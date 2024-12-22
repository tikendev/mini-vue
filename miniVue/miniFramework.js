class tikenJS {
    // Dependencies
    deps = new Map();

    constructor(options) {
        this.origin = options.data();

        const self = this;
        console.log(self);

        // Destination
        this.$data = new Proxy(this.origin, {
            get(target, name) {
                if (Reflect.has(target, name)) {
                    self.track(target, name);
                    return Reflect.get(target, name);
                }

                console.warn(`The property, ${name}, no existe`);
                
                return '';
            },
            set(target, name, value) {
                console.log('Modifying!');
                Reflect.set(target, name, value);
                self.trigger(name);
            },
        });
    }

    track(target, name) {
        if (!this.deps.has(name)) {
            const effect = () => {
                document.querySelectorAll(`*[t-text=${name}]`).forEach(el => {
                    this.tText(el, target, name);
                });

                // document.querySelectorAll(`*[t-model=${name}]`).forEach(el => {
                //     this.tModel(el, target, name);
                // });
            }

            this.deps.set(name, effect);
        }
    }

    trigger(name) {
        const effect = this.deps.get(name);
        effect();
    }

    mount() {
        document.querySelectorAll('*[t-text]').forEach(el => {
            this.tText(el, this.$data, el.getAttribute('t-text'));
        });

        document.querySelectorAll('*[t-model]').forEach(el => {
            const name = el.getAttribute('t-model');
            this.tModel(el, this.$data, name);

            el.addEventListener('input', () => {
                Reflect.set(this.$data, name, el.value);
            });
        });

        document.querySelectorAll('*[t-bind]').forEach(el => {
            const [attr, name] = el.getAttribute('t-bind').match(/(\w+)/g);
            this.tBind(el, this.$data, name, attr);
        });
    }

    tText(el, target, name) {
        el.textContent = Reflect.get(target, name);
    }

    tModel(el, target, name) {
        el.value = Reflect.get(target, name);
    }

    tBind(el, target, name, attr) {
        el.setAttribute(attr, Reflect.get(target, name));
    }
}

const myFramework = {
    createApp(options) {
        return new tikenJS(options);
    }
}