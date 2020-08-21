import { CartItem } from './cart-item';
import { TestBed } from '@angular/core/testing';
import { CartStore } from './cart-store';
import { initialState, CartState } from './cart-state';

describe('CartStore', () => {
  let cartStore: CartStore;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [CartStore] });
    cartStore = TestBed.get(CartStore);
  });

  it('should create an instance', () => {
    expect(cartStore).toBeTruthy();
  });

  it('can add item into cart state', () => {
    const currentState = initialState;
    expect(currentState.cartItems.length).toBe(0);

    const cartItem: CartItem = {
      modelId: 'a',
      price: 40,
      title: 'test',
      imgUrl: 'img/thumbnail1.png',
      quantity: 2,
      itemTotal: 80,
      modelPath: '/model/model.stl',
    };

    cartStore.addCartItem(cartItem);

    const expectedState = {
      cartItems: [cartItem],
    };

    expect(cartStore.state).toEqual(expectedState);
  });

  it('can clear cart', () => {
    const cartItem: CartItem = {
      modelId: 'a',
      price: 40,
      title: 'test',
      imgUrl: 'img/thumbnail1.png',
      quantity: 2,
      itemTotal: 80,
      modelPath: '/model/model.stl',
    };

    cartStore.addCartItem(cartItem);
    const currentState = {
      cartItems: [cartItem],
    };

    expect(cartStore.state).toEqual(currentState);

    // Act
    cartStore.clearCart();

    expect(cartStore.state).toEqual(initialState);
  });

  it('can resore cart', () => {
    //#region Arrange
    const currentState = initialState;

    expect(cartStore.state).toEqual(currentState);

    const cartItem: CartItem = {
      modelId: 'a',
      price: 40,
      title: 'test',
      imgUrl: 'img/thumbnail1.png',
      quantity: 2,
      itemTotal: 80,
      modelPath: '/model/model.stl',
    };

    const expectedState: CartState = {
      cartItems: [cartItem],
    };

    //#endregion

    //#region Act

    cartStore.restoreCart(expectedState);

    //#endregion

    //#region Assert
    expect(cartStore.state).toEqual(expectedState);
    //#endregion
  });

  it('can remove cart item', () => {
    //#region Arrange
    expect(cartStore.state).toEqual(initialState);

    const cartItem: CartItem = {
      modelId: 'a',
      price: 40,
      title: 'test',
      imgUrl: 'img/thumbnail1.png',
      quantity: 2,
      itemTotal: 80,
      modelPath: '/model/model.stl',
    };

    const cartItem1: CartItem = {
      modelId: 'aaawef',
      price: 20,
      title: 'test2',
      imgUrl: 'img/thumbnail2.png',
      quantity: 1,
      itemTotal: 20,
      modelPath: '/model/model2.stl',
    };

    const currentState: CartState = {
      cartItems: [cartItem, cartItem1],
    };
    cartStore.restoreCart(currentState);
    expect(cartStore.state).toEqual(currentState);
    //#endregion

    //#region Act
    cartStore.removeCartItem(cartItem1);
    //#endregion

    //#region Assert
    const expectedState: CartState = {
      cartItems: [cartItem],
    };
    expect(cartStore.state).toEqual(expectedState);
    //#endregion
  });

  it('can update cart item', () => {
    //#region Arrange
    expect(cartStore.state).toEqual(initialState);

    const cartItem: CartItem = {
      modelId: 'a',
      price: 40,
      title: 'test',
      imgUrl: 'img/thumbnail1.png',
      quantity: 2,
      itemTotal: 80,
      modelPath: '/model/model.stl',
    };

    const cartItem1: CartItem = {
      modelId: 'aaawef',
      price: 20,
      title: 'test2',
      imgUrl: 'img/thumbnail2.png',
      quantity: 1,
      itemTotal: 20,
      modelPath: '/model/model2.stl',
    };

    const currentState: CartState = {
      cartItems: [cartItem, cartItem1],
    };
    cartStore.restoreCart(currentState);
    expect(cartStore.state).toEqual(currentState);
    //#endregion

    //#region Act
    const cartItemToUpdate: CartItem = {
      modelId: 'aaawef',
      price: 20,
      title: 'test22323',
      imgUrl: 'img/thumbnail2.png',
      quantity: 3,
      itemTotal: 60,
      modelPath: '/model/model2.stl',
    };
    cartStore.updateCartItem(cartItemToUpdate);
    //#endregion

    //#region Assert
    const expectedState: CartState = {
      cartItems: [cartItem, cartItemToUpdate],
    };
    expect(cartStore.state).toEqual(expectedState);
    //#endregion
  });
});
