import { CartItem } from '../types';

export const Cart = {
  get(): CartItem[] {
    try {
      return JSON.parse(localStorage.getItem('gxCart') || '[]');
    } catch {
      return [];
    }
  },
  save(items: CartItem[]) {
    localStorage.setItem('gxCart', JSON.stringify(items));
  },
  add(game: CartItem, onToast?: (msg: string, type: string) => void) {
    const cart = this.get();
    if (!cart.find((i) => i.id === game.id)) {
      cart.push({ id: game.id, title: game.title, price: game.price, image: game.image });
      this.save(cart);
    }
    onToast?.(`${game.title} added to cart!`, 'success');
    window.dispatchEvent(new Event('cartUpdated'));
  },
  remove(id: string) {
    const cart = this.get().filter((i) => i.id !== id);
    this.save(cart);
    window.dispatchEvent(new Event('cartUpdated'));
  },
  count(): number {
    return this.get().length;
  },
};
