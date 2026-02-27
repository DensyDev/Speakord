import { ResultReason, SpeechConfig, SpeechSynthesisOutputFormat, SpeechSynthesizer } from "microsoft-cognitiveservices-speech-sdk";
import { SpeechSynthesizer as ISpeechSynthesizer, PitchPoint, Speeker } from "..";
import { sanitizeSSML } from "../../util";

export class AzureSpeechSynthesizer implements ISpeechSynthesizer {
    private config: SpeechConfig;

    constructor(key: string, region: string) {
        this.config = SpeechConfig.fromSubscription(key, region);
        this.config.speechSynthesisOutputFormat = SpeechSynthesisOutputFormat.Riff24Khz16BitMonoPcm;
    }

    async synthesize(text: string, speeker: Speeker): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const synthesizer = new SpeechSynthesizer(this.config);
            const ssml = this.buildSsml(text, speeker);

            synthesizer.speakSsmlAsync(
                ssml,
                (result) => {
                    if (result.reason === ResultReason.SynthesizingAudioCompleted) {
                        resolve(Buffer.from(result.audioData));
                    } else {
                        reject(new Error(`Azure Synthesis Error: ${result.errorDetails}`));
                    }
                    synthesizer.close();
                },
                (err) => {
                    reject(err);
                    synthesizer.close();
                }
            );
        });
    }

    private buildSsml(text: string, speeker: Speeker): string {
        const { temperament, emotion: emotional, voice } = speeker;

        const combinedRate = temperament.rateBias + (emotional.arousal * 0.3);
        const pitch = `${Math.floor(temperament.pitchBias * 50)}%`;
        const rate = `${Math.floor(combinedRate * 50)}%`;
        const range = `${Math.floor((temperament.energyBias + emotional.arousal) * 50)}%`;
        const volume = `${Math.floor(emotional.volume * 100)}%`;
        const contour = emotional.contour
            ? this.buildContourString(emotional.contour)
            : "";

        const azureStyle = this.mapToAzureStyle(emotional.valence, emotional.arousal);

        return `
            <speak version='1.0' xml:lang='${voice.locale}' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='http://www.w3.org/2001/mstts'>
                <voice name='${voice.name}'>
                    <mstts:express-as style='${azureStyle}' styledegree='${Math.abs(emotional.valence * 2)}'>
                        <prosody 
                            pitch='${pitch}' 
                            rate='${rate}' 
                            range='${range}' 
                            volume='${volume}'
                            ${contour ? `contour='${contour}'` : ''}
                        >
                            ${sanitizeSSML(text)}
                        </prosody>
                    </mstts:express-as>
                </voice>
            </speak>`;
    }

    private buildContourString(points: PitchPoint[]): string {
        if (!points || points.length === 0) return "";

        return points.map(point => {
            let change = point.change.trim();
            if (!/^[+\-]/.test(change) && !/^[a-zA-Z]/.test(change)) {
                change = `+${change}`;
            }
            return `(${Math.floor(point.pos)}%,${change})`;
        }).join(' ');
    }

    private mapToAzureStyle(valence: number, arousal: number): string {
        if (valence > 0.4) return 'cheerful';
        if (valence < -0.4 && arousal > 0.3) return 'angry';
        if (valence < -0.4 && arousal < -0.1) return 'sad';
        if (arousal > 0.5) return 'excited';
        if (valence > 0.2 && arousal < -0.2) return 'friendly';
        return 'general';
    }
}