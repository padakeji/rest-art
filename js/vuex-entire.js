Vue.use(Vuex);
Vue.use(VueResource);
Vue.use(Keen);

var V = Vue.util;

var METHODS = {
    GET: 'GET',
    POST: 'POST',
    HEAD: 'HEAD',
    DELETE: 'DELETE',
    PUT: 'PUT',
    PATCH: 'PATCH'
};

function getChosenApi(state) {
    var api = _.findWhere(state.apiGroups, {'id': state.chosenApiId});
    if (!api) {
        var group = _.findWhere(state.apiGroups, {'id': state.chosenGroupId});
        if (group) {
            api = _.findWhere(group.apiList, {'id': state.chosenApiId});
        }
    }
    return api;
}

var state = {
    settings: {
        serverRoot: ''
    },
    apiGroups: [],
    chosenGroupId: '',
    chosenApiId: ''
};


var mutations = {
    ADD_GROUP: function (state) {
        var id = _.uniqueId('group_');
        var defaultGroup = {
            id: id,
            title: 'New Group',
            apiList: []
        };
        state.apiGroups.push(defaultGroup);
        state.chosenGroupId = id;
    },
    ADD_API: function (state) {
        var defaultApi = {
            id: _.uniqueId('api_'),
            name: 'New API',
            method: 'GET',
            uri: '',
            headers: [], //{name: '', value: ''}
            urlParams: [],
            body: {},
            response: {}
        };
        if (state.chosenGroupId) {
            var group = _.findWhere(state.apiGroups, {id: state.chosenGroupId});
            group.apiList.push(defaultApi)
        } else {
            state.apiGroups.push(defaultApi);
        }
        state.chosenApiId = defaultApi.id;
        Vue.nextTick(function () {
            V.query('input[name=request-url]').focus();
        });
    },
    SELECT_GROUP: function (state, groupId) {
        state.chosenGroupId = groupId;
    },
    SELECT_API: function (state, apiId) {
        state.chosenApiId = apiId;
    },
    UPDATE_REQUEST: function (state, req) {
        var api = getChosenApi(state);
        if (api) {
            _.extend(api, req);
        } else {
            console.error('ChosenAPI not exist!')
        }

    },
    UPDATE_HEADER: function (state, header) {
        var api = getChosenApi(state);
        if (api) {
            api.headers.push(header);
        } else {
            console.error('ChosenAPI not exist!')
        }
    },
    UPDATE_URL_PARAMS: function (state, param) {
        var api = getChosenApi(state);
        if (api) {
            api.urlParams.push(param);
        } else {
            console.error('ChosenAPI not exist!')
        }
    },
    SEND_REQUEST: function (state) {
        var api = getChosenApi(state);
        if (api.method) {
            var method = "", url = "", headers = {}, params = {}, body = {};
            //URL
            if (api.uri.indexOf('http://') !== 0 && api.uri.indexOf('https://') !== 0) {
                url = state.settings.serverRoot ? state.settings.serverRoot + api.uri : api.uri;
            } else {
                url = api.uri;
            }

            //HEADER
            _.each(api.headers, function (header) {
                headers[header.name] = header.value;
            });

            //PARAMS
            _.each(api.urlParams, function (param) {
                params[param.name] = param.value;
            });

            if (api.method == METHODS.PATCH || api.method == METHODS.POST || api.method == METHODS.PUT) {
                method = api.method.toLowerCase();
                Vue.http[method](url, body, {
                    headers: headers,
                    params: params
                }).then(function (res) {
                    console.log(res);
                    api.response = res;
                }, function (error) {
                    api.response = error;
                })
            } else if (api.method == METHODS.GET || api.method == METHODS.DELETE || api.method == METHODS.HEAD) {
                method = api.method.toLowerCase();
                Vue.http[method](url, {
                    headers: headers,
                    params: params
                }).then(function (res) {
                    console.log(res);
                    api.response = res;
                }, function (error) {
                    api.response = error;
                })
            } else {
                console.error('Request method not support yet!')
            }
        } else {
            console.error('Request method not exist!')
        }
    }
};

var store = new Vuex.Store({state: state, mutations: mutations});

var actions = {
    addGroup: function () {
        store.dispatch('ADD_GROUP');
    },
    addApi: function () {
        store.dispatch('ADD_API');
    },
    selectGroup: function (state, groupId) {
        store.dispatch('SELECT_GROUP', groupId);
    },
    selectApi: function (state, apiId) {
        store.dispatch('SELECT_API', apiId);
    },
    updateRequest: function (state, req) {
        store.dispatch('UPDATE_REQUEST', req);
    },
    updateHeader: function (state, header) {
        store.dispatch('UPDATE_HEADER', header);
    },
    updateUrlParams: function (state, param) {
        store.dispatch('UPDATE_URL_PARAMS', param);
    },
    sendRequest: function(state){
        store.dispatch('SEND_REQUEST')
    }
};
