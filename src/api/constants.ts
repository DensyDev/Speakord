import * as dotenv from 'dotenv';

/**
 * Configuration dotenv
 */
dotenv.config();

export const BOT_TOKEN = process.env.BOT_TOKEN || '';
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
export const OPENAI_GPT_MODEL = process.env.OPENAI_GPT_MODEL || '';
export const OPENAI_TTS_MODEL = process.env.OPENAI_TTS_MODEL || '';
export const AZURE_KEY = process.env.AZURE_KEY || '';
export const AZURE_REGION = process.env.AZURE_REGION || '';

/**
 * Check for all variables
 */
if (!BOT_TOKEN || !OPENAI_API_KEY || !OPENAI_GPT_MODEL || !OPENAI_TTS_MODEL || !AZURE_KEY || !AZURE_REGION) {
    throw new Error('One of the variables is not found: (BOT_TOKEN, OPENAI_API_KEY, OPENAI_GPT_MODEL, OPENAI_TTS_MODEL, AZURE_KEY, AZURE_REGION)');
}