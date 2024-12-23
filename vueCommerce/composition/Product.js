app.component('Product', {
    template: `
            <section class="product">
                <div class="product__thumbnails">
                    <div
                        v-for="(image, index) in product.images"
                        :key="image.thumbnail"
                        class="thumb" 
                        :class="{ active: activeImage === index }" 
                        :style="{ backgroundImage: 'url(' + product.images[index].thumbnail + ')' }"
                        @click="activeImage = index">
                    </div>
                </div>
                <div class="product__image">
                    <img :src="product.images[activeImage].image" :alt="product.name">
                </div>
            </section>
            <section class="description">
                <h4>{{ product.name.toUpperCase() }} {{ product.stock === 0 ? '😱' : '😎'}}</h4>
                <span class="badge new" v-if="product.new">Nuevo</span>
                <span class="badge offer" v-if="product.offer">Oferta</span>
                <p class="description__status" v-if="product.stock === 3">{{ 'Solo quedan ' + product.stock + ' unidades' }}</p>
                <p class="description__status" v-else-if="product.stock === 2">El producto está por terminarse</p>
                <p class="description__status" v-else-if="product.stock === 1" :class="{ lastStock: product.stock === 1 }">Última unidad disponible!</p>
                <p class="description__status" v-else-if="product.stock === 0">Producto agotado...</p>
                <p class="description__price" :style="{ color: price_color }">{{ new Intl.NumberFormat("es-ES").format(product.price) }}€</p>
                <p class="description__content">
                    {{ product.content }}
                </p>
                <div class="discount">
                    <span>Código de descuento:</span>
                    <input type="text" placeholder="Ingrese tu código" @keyup.enter="applyDiscount($event)" />
                </div>
                <button :disabled="product.stock === 0" @click="sendToCart">Agregar al carrito</button>
            </section>
    `,
    props: ['product'],
    emit: ['sendtocart'],
    setup(props, context) {
        const productState = reactive({
            activeImage: 0,
            // price_color: 'rgba(104, 104, 209)',
            price_color: computed(() => 
                props.product.stock <= 1 ? 'rgba(188, 30, 67)' : 'rgba(104, 104, 209)'
            ),
        });

        // const price_color = computed(() => {
        //     if (props.product.stock === 0) {
        //         return 'rgba(154, 144, 147)';
        //     }

        //     if (props.product.stock <= 1) {
        //         return 'rgba(188, 30, 67)';
        //     }

        //     return 'rgba(104, 104, 209)';
        // });

        const discountCodes = ref(['PLATZI20', 'IOSAMUEL']);
        const applyDiscount = (event) => {
            const discountCodeIndex = discountCodes.value.indexOf(event.target.value);
            if (discountCodeIndex >= 0) {
                props.product.price *= 50 / 100;
                discountCodes.splice(discountCodeIndex, 1);
            }
        }

        const sendToCart = () => {
            context.emit('sendtocart', props.product);
        }

        watch( 
            () => productState.activeImage, 
            (value, oldValue) => {
                console.log(value, oldValue);
            }
        );

        // watch( () => props.product.stock, (stock) => {
        //     if (stock === 0) {
        //         productState.price_color = 'rgba(154, 144, 147)';
        //     }

        //     if (stock <= 1) {
        //         productState.price_color = 'rgba(188, 30, 67)';
        //     }
        // });

        return {
            ...toRefs(productState),
            applyDiscount,
            // price_color,

            sendToCart
        }
    }
});