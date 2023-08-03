export function getEnvConfig(vars: Record<string, string | undefined>, nodeEnv?: string | undefined) {
  nodeEnv = nodeEnv ?? 'development';

  const prod = nodeEnv === 'production';
  const test = !prod && nodeEnv === 'test';
  const dev = !prod && !test;
  const mode = {
    prod,
    test,
    dev,
    name: prod ? 'production' : test ? 'test' : 'development',
  };

  return {
    faro: {
      otlpEndpointPublic: vars['OTLP_ENDPOINT_PUBLIC']!,
      otlpEndpointPrivate: vars['OTLP_ENDPOINT_PRIVATE']!,
    },
    client: {
      packageName: vars['DEMO_CLIENT_PACKAGE_NAME']!,
    },
    database: {
      host: vars['DATABASE_HOST']!,
      name: vars['DATABASE_NAME']!,
      password: vars['DATABASE_PASSWORD']!,
      port: vars['DATABASE_PORT']!,
      user: vars['DATABASE_USER']!,
    },
    package: {
      version: vars['DEMO_PACKAGE_VERSION']!,
    },
    server: {
      packageName: vars['DEMO_SERVER_PACKAGE_NAME']!,
      port: vars['DEMO_PORT']!,
    },
    mode,
  };
}

export function getPublicEnvConfig({ database: _database, ...env } = getEnvConfig(process.env)) {
  return env;
}

export type Env = ReturnType<typeof getEnvConfig>;

export type PublicEnv = ReturnType<typeof getPublicEnvConfig>;
