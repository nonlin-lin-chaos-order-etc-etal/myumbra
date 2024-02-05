import { config, DotenvParseOutput } from 'dotenv';
const parsedEnv: DotenvParseOutput|undefined = config().parsed;

export default function (): DotenvParseOutput|undefined {
  if (typeof parsedEnv === 'undefined') return parsedEnv;
  // Let's stringify our variables
  Object.keys(parsedEnv).forEach( key => {
    if (typeof parsedEnv[key] === 'string') {
      parsedEnv[key] = JSON.stringify(parsedEnv[key]);
    }
  });  
  return parsedEnv;
};
