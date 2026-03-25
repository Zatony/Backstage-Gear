import { beforeEach, vi } from 'vitest';

export const testState = globalThis.__BG_TEST_STATE__;

export const page = {
  ad: 'ad',
  adText_Button: 'adText_Button',
  adDescPriceBtn: 'adDescPriceBtn',
  priceButtonGroup: 'priceButtonGroup',
  inCart: 'inCart',
  myAd: 'myAd',
  notInCart: 'notInCart',
  submitBtnWrapper: 'submitBtnWrapper',
  submitBtn: 'submitBtn',
  errorMsg: 'errorMsg',
  formRow: 'formRow',
  formRowTextarea: 'formRowTextarea',
  inputError: 'inputError',
  textareaError: 'textareaError',
  newAdTextContainer: 'newAdTextContainer',
  newAdText: 'newAdText',
  newAdLine: 'newAdLine',
  editAdTextContainer: 'editAdTextContainer',
  editAdText: 'editAdText',
  editAdLine: 'editAdLine',
  ads: 'ads',
  categoriesSection: 'categoriesSection',
  categoriesLine: 'categoriesLine',
  categoriesContainer: 'categoriesContainer',
  categoryContainer: 'categoryContainer',
  fallbackText: 'fallbackText',
  chatArea: 'chatArea',
  messageBubbleRight: 'messageBubbleRight',
  messageBubbleLeft: 'messageBubbleLeft',
  messageBubbleContent: 'messageBubbleContent',
  messageBubbleTime: 'messageBubbleTime',
  messageDetailHeader: 'messageDetailHeader',
  detailAvatar: 'detailAvatar',
  detailUserInfo: 'detailUserInfo',
  detailUserName: 'detailUserName',
  conversationsSidebar: 'conversationsSidebar',
  sidebarHeader: 'sidebarHeader',
  conversationsList: 'conversationsList',
  emptyConversations: 'emptyConversations',
  conversationItemActive: 'conversationItemActive',
  conversationItem: 'conversationItem',
  userAvatar: 'userAvatar',
  conversationInfo: 'conversationInfo',
  conversationName: 'conversationName',
  conversationPreview: 'conversationPreview',
  conversationDate: 'conversationDate',
  filterContainer: 'filterContainer',
  show: 'show',
  filterCategories: 'filterCategories',
  filterLine: 'filterLine',
  filterCategoriesList: 'filterCategoriesList',
  filterCategory: 'filterCategory',
  filterCheckBox: 'filterCheckBox',
  filterCondition: 'filterCondition',
  filterConditionList: 'filterConditionList',
  filterBrandPrice: 'filterBrandPrice',
  brandRow: 'brandRow',
  filterLineBrand: 'filterLineBrand',
  filterBrands: 'filterBrands',
  priceRow: 'priceRow',
  filterLinePrice: 'filterLinePrice',
  priceInputs: 'priceInputs',
  priceMin: 'priceMin',
  priceMax: 'priceMax',
  adTextBlock: 'adTextBlock',
  adTitle: 'adTitle',
  adMeta: 'adMeta',
  adDescBlock: 'adDescBlock',
  adCondLabel: 'adCondLabel',
  adDescLabel: 'adDescLabel',
  adDescText: 'adDescText',
  adImageAndUser: 'adImageAndUser',
  mainImg: 'mainImg',
  userRow: 'userRow',
  userIcon: 'userIcon',
  username: 'username',
  ratingRow: 'ratingRow',
  rating: 'rating',
  voteActions: 'voteActions',
  voteUpButton: 'voteUpButton',
  voteDownButton: 'voteDownButton',
  messageActions: 'messageActions',
  actionBtn: 'actionBtn',
  replyBtn: 'replyBtn',
  deleteBtn: 'deleteBtn',
  emptyDetail: 'emptyDetail',
  emptyText: 'emptyText',
  modalOverlay: 'modalOverlay',
  modal: 'modal',
  modalHeader: 'modalHeader',
  modalBody: 'modalBody',
  modalTextarea: 'modalTextarea',
  modalActions: 'modalActions',
  modalCancelBtn: 'modalCancelBtn',
  modalSendBtn: 'modalSendBtn',
  newAdSection: 'newAdSection',
  carouselWrapper: 'carouselWrapper',
  carouselArrow: 'carouselArrow',
  left: 'left',
  right: 'right',
  newAds: 'newAds',
  searchbar: 'searchbar',
  searchInput: 'searchInput',
  reportedAdCard: 'reportedAdCard',
  adImageSection: 'adImageSection',
  adImage: 'adImage',
  adInfoSection: 'adInfoSection',
  adDescription: 'adDescription',
  userSection: 'userSection',
  userInfo: 'userInfo',
  userName: 'userName',
  userContact: 'userContact',
  actionsSection: 'actionsSection',
  deleteAdBtn: 'deleteAdBtn',
  deleteUserBtn: 'deleteUserBtn',
  dismissBtn: 'dismissBtn',
  priceButtonsFullWidth: 'priceButtonsFullWidth',
  price: 'price',
  buttonRow: 'buttonRow',
  reportBtn: 'reportBtn',
  reachOutBtn: 'reachOutBtn',
};

function mockJson(data, ok = true) {
  return Promise.resolve({
    ok,
    json: async () => data,
  });
}

export function setupCommonBeforeEach() {
  beforeEach(() => {
    vi.clearAllMocks();
    testState.token = null;
    testState.tokenDuration = 1000;
    testState.authUserId = null;
    testState.routeToken = null;
    testState.loaderData = null;
    testState.locationState = null;
    testState.searchParams = new URLSearchParams('id=1');
    testState.navigate = vi.fn();
    testState.submit = vi.fn();
    testState.revalidate = vi.fn();
    testState.lastRouterConfig = null;
    testState.lastRouterProviderProps = null;

    global.fetch = vi.fn(async (input, init) => {
      const url = String(input);
      if (url.includes('/categories')) return mockJson([{ id: 1, name: 'guitar', picture: 'cat.png' }]);
      if (url.includes('/brands')) return mockJson([{ id: 1, brand_name: 'Yamaha' }]);
      if (url.includes('/latest_ads')) return mockJson([{ id: 5, name: 'Bass', description: 'd', files: ['a.png'], price: 1000 }]);
      if (url.includes('/filtered_ads') || url.endsWith('/ads')) return mockJson([{ id: 9, item_name: 'Amp', description: 'loud', files: ['x.png'], price: 1234 }]);
      if (url.includes('/me/cart') && init?.method === 'GET') return mockJson([{ id: 5 }]);
      if (url.includes('/me/my_ads')) return mockJson([{ id: 12 }]);
      if (url.includes('/me/my_profile')) return mockJson({ username: 'john', profile_picture: 'u.png' });
      if (url.includes('/me/is_admin')) return mockJson({ is_admin: false });
      if (url.includes('/reported_ads/') && init?.method === 'GET') {
        return mockJson([{ id: 10, user_id: 8, item_name: 'Item', description: 'Desc', files: 'z.png', email: 'a@b.com' }]);
      }
      if (url.includes('/profiles/')) return mockJson({ username: 'owner', profile_picture: 'p.png', phone_number: '36201234567' });
      if (url.includes('/login') || url.includes('/signup')) return mockJson({ token: 'tkn' });
      if (url.includes('/update_password')) return mockJson({}, true);
      return mockJson({}, true);
    });

    window.alert = vi.fn();
    window.confirm = vi.fn(() => true);
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: vi.fn(),
    });
    Object.defineProperty(HTMLElement.prototype, 'scrollBy', {
      configurable: true,
      value: vi.fn(),
    });
  });
}