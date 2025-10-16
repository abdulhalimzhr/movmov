import { vi } from 'vitest';
import { config } from '@vue/test-utils';
import { defineComponent, h } from 'vue';

const mockFetch = vi.fn();
mockFetch.mockResolvedValue({
  success: true,
  data: {
    data: [],
    total: 0,
    total_pages: 0,
    per_page: 10,
    page: 1
  }
});

config.global.mocks = {
  $fetch: mockFetch,
  useRouter: vi.fn(() => ({
    push: vi.fn()
  })),
  useRoute: vi.fn(() => ({
    query: {}
  })),
  useSeoMeta: vi.fn()
};

config.global.provide = {
  router: {
    push: vi.fn()
  }
};

const simpleStub = (tag: string) =>
  defineComponent({
    name: `Stub${tag}`,
    setup(_, { slots, attrs }) {
      return () => h(tag, attrs, slots.default?.());
    }
  });

const buttonStub = defineComponent({
  name: 'StubVBtn',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h(
        'button',
        {
          type: 'button',
          ...attrs
        },
        slots.default?.()
      );
  }
});

const tooltipStub = defineComponent({
  name: 'StubVTooltip',
  setup(_, { slots }) {
    return () =>
      h('div', {}, [
        slots.activator?.({ props: {} }) ?? null,
        slots.default?.() ?? null
      ]);
  }
});

config.global.stubs = {
  'v-card': simpleStub('div'),
  VCard: simpleStub('div'),
  'v-card-item': simpleStub('div'),
  VCardItem: simpleStub('div'),
  'v-card-title': simpleStub('div'),
  VCardTitle: simpleStub('div'),
  'v-card-subtitle': simpleStub('div'),
  VCardSubtitle: simpleStub('div'),
  'v-card-text': simpleStub('div'),
  VCardText: simpleStub('div'),
  'v-card-actions': simpleStub('div'),
  VCardActions: simpleStub('div'),
  'v-chip': simpleStub('span'),
  VChip: simpleStub('span'),
  'v-btn': buttonStub,
  VBtn: buttonStub,
  'v-icon': simpleStub('i'),
  VIcon: simpleStub('i'),
  'v-row': simpleStub('div'),
  VRow: simpleStub('div'),
  'v-col': simpleStub('div'),
  VCol: simpleStub('div'),
  'v-container': simpleStub('div'),
  VContainer: simpleStub('div'),
  'v-text-field': simpleStub('input'),
  VTextField: simpleStub('input'),
  'v-alert': simpleStub('div'),
  VAlert: simpleStub('div'),
  'v-pagination': simpleStub('div'),
  VPagination: simpleStub('div'),
  'v-dialog': simpleStub('div'),
  VDialog: simpleStub('div'),
  'v-list': simpleStub('ul'),
  VList: simpleStub('ul'),
  'v-list-item': simpleStub('li'),
  VListItem: simpleStub('li'),
  'v-list-item-title': simpleStub('div'),
  VListItemTitle: simpleStub('div'),
  'v-list-item-subtitle': simpleStub('div'),
  VListItemSubtitle: simpleStub('div'),
  'v-divider': simpleStub('hr'),
  VDivider: simpleStub('hr'),
  'v-spacer': simpleStub('div'),
  VSpacer: simpleStub('div'),
  'v-tooltip': tooltipStub,
  VTooltip: tooltipStub
};

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
} as {
  getItem: ReturnType<typeof vi.fn>;
  setItem: ReturnType<typeof vi.fn>;
  removeItem: ReturnType<typeof vi.fn>;
  clear: ReturnType<typeof vi.fn>;
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      client: true
    }
  },
  writable: true
});
