var RequestPanel = Vue.extend({
    template: '#requestPanel',
    components: {
        UiTextbox: Keen.UiTextbox,
        UiIconButton: Keen.UiIconButton,
        UiRadioGroup: Keen.UiRadioGroup,
        UiTabs: Keen.UiTabs,
        UiTab: Keen.UiTab,
        UiButton: Keen.UiButton
    },
    vuex: {
        getter: {
            chosenApiId: function (state) {
                return state.chosenApiId;
            },
            chosenApi: function (state) {
                return getChosenApi(state);
            }
        },
        actions: {
            updateRequest: actions.updateRequest,
            updateHeader: actions.updateHeader,
            updateUrlParams: actions.updateUrlParams,
            sendRequest: actions.sendRequest
        }
    },
    activate: function (done) {
        var api = getChosenApi(store.state);
        this.method = api.method;
        this.uri = api.uri;
        this.headers = api.headers;
        this.urlParams = api.urlParams;
        this.requestMethods = _.map(METHODS, function (value, key) {
            return {text: key, value: value};
        });
        done();
    },
    data: function () {
        return {
            requestMethods: [],
            uri: '',
            method: '',
            headers: [],
            urlParams: []
        }
    },
    watch: {
        method: function (val, oldVal) {
            this.updateRequest({method: val});
        },
        uri: function (val, oldVal) {
            this.updateRequest({uri: val})
        }
    },
    methods: {
        addHeader: function () {
            this.updateHeader({name: '', value: ''});
        },
        addParam: function () {
            this.updateUrlParams({name: '', value: ''});
        }
    }
});

var ResponsePanel = Vue.extend({
    template: '#responsePanel',
    components: {},
    vuex: {
        getters: {
            response: function(state){
                return getChosenApi(state).response;
            }
        }
    },
    activate: function(done){
        done();
    },
    data: function () {
        return {

        }
    },
    methods: {}
});


var vmContainer = new Vue({
    el: '.container',
    store: store,
    vuex: {
        getters: {
            apiGroups: function (state) {
                return state.apiGroups;
            },
            chosenApiId: function (state) {
                return state.chosenApiId;
            },
            settings: function (state) {
                return state.settings;
            }
        },
        actions: {
            addGroup: actions.addGroup,
            addApi: actions.addApi,
            selectGroup: actions.selectGroup,
            selectApi: actions.selectApi
        }
    },
    components: {
        UiToolbar: Keen.UiToolbar,
        UiIconButton: Keen.UiIconButton,
        UiButton: Keen.UiButton,
        UiCollapsible: Keen.UiCollapsible,
        UiModal: Keen.UiModal,
        UiTextbox: Keen.UiTextbox,
        RequestPanel: RequestPanel,
        ResponsePanel: ResponsePanel
    },
    data: {
        showSettings: false
    },
    methods: {
        openSettings: function () {
            this.showSettings = true;
        },
        saveSettings: function () {
            this.showSettings = false;
        }
    }
});