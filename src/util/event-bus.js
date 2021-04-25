const EventBus = {};

EventBus.install = (Vue) => {
    Vue.prototype.$bus = new Vue({});
};

export default EventBus;
