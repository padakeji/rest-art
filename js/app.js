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
                return state.chosenApi;
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
        var api = state.chosenApi;
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
    components: {
        UiTabs: Keen.UiTabs,
        UiTab: Keen.UiTab
    },
    vuex: {
        getters: {
            response: function(state){
                return state.chosenApi.response;
            },
            parsedContent: function(state){
                var api = state.chosenApi;
                var response = api.response;
                var content = "";
                _.each(response.headers, function(header, name){
                    if(name.toLowerCase() == "content-type"){
                        header = header.toLowerCase();
                        if(header.indexOf('text/html') != -1){
                            content = response.body;
                        }else if(header.indexOf('application/json') != -1 ){
                            content = JSON.stringify(JSON.parse(response.body), null, 2);
                        }
                        return;
                    }
                });
                return content;
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
    watch:{
        parsedContent: function(val, oldVal){
            hljs.highlightBlock(this.$els.codeBlock);
            console.log(val);
        }
    },
    methods: {}
});

var vmContainer = new Vue({
    el: '#container',
    store: store,
    vuex: {
        getters: {
            apiGroups: function (state) {
                return state.apiGroups;
            },
            chosenApi: function (state) {
                return state.chosenApi;
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