import { vi } from "vitest";
import { config } from "@vue/test-utils";
import { createTestingPinia } from '@pinia/testing'
import { createVuetify } from 'vuetify'

// Mock Nuxt auto-imports
config.global.mocks = {
  $fetch: vi.fn(),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
  useRoute: vi.fn(() => ({
    query: {},
  })),
  useSeoMeta: vi.fn(),
};

// Mock Vue auto-imports
config.global.plugins = [
  createTestingPinia(),
  createVuetify({
    components: {
      VCard: true,
      VCardTitle: true,
      VCardSubtitle: true,
      VCardItem: true,
      VCardText: true,
      VCardActions: true,
      VChip: true,
      VIcon: true,
      VBtn: true,
    }
  })
]

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
} as {
  getItem: ReturnType<typeof vi.fn>;
  setItem: ReturnType<typeof vi.fn>;
  removeItem: ReturnType<typeof vi.fn>;
  clear: ReturnType<typeof vi.fn>;
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock import.meta.client
Object.defineProperty(globalThis, "import", {
  value: {
    meta: {
      client: true,
    },
  },
  writable: true,
});
