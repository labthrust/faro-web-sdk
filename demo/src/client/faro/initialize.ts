import { createRoutesFromChildren, matchRoutes, Routes, useLocation, useNavigationType } from 'react-router-dom';

import {
  initializeFaro as coreInit,
  getWebInstrumentations,
  ReactIntegration,
  ReactRouterVersion,
} from '@grafana/faro-react';
import type { Faro } from '@grafana/faro-react';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';

import { env } from '../utils';

export function initializeFaro(): Faro {
  const faro = coreInit({
    url: `${env.faro.otlpEndpointPublic}`,
    instrumentations: [
      ...getWebInstrumentations({
        captureConsole: true,
      }),
      new TracingInstrumentation(),
      new ReactIntegration({
        router: {
          version: ReactRouterVersion.V6,
          dependencies: {
            createRoutesFromChildren,
            matchRoutes,
            Routes,
            useLocation,
            useNavigationType,
          },
        },
      }),
    ],
    session: (window as any).__PRELOADED_STATE__?.faro?.session,
    batching: {
      enabled: false,
    },
    app: {
      name: env.client.packageName,
      version: env.package.version,
      environment: env.mode.name,
    },
  });

  faro.api.pushLog(['Faro was initialized']);

  return faro;
}
