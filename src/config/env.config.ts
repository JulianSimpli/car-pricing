import { ConfigService } from '@nestjs/config';

let configServiceInstance: ConfigService;

export function setConfigService(configService: ConfigService) {
  configServiceInstance = configService;
}

export const env = Object.freeze({
  get cookieKey(): string {
    return configServiceInstance.get<string>('COOKIE_KEY');
  },

  get port(): number {
    return configServiceInstance.get<number>('PORT', 3000);
  },

  get nodeEnv(): string {
    return configServiceInstance.get<string>('NODE_ENV', 'development');
  },

  get database() {
    return Object.freeze({
      url: configServiceInstance.get<string>('DATABASE_URL'),
    });
  }
});