import React, { useState, useEffect } from 'react'
import base from "../firebase"

export function Item({ item, index, inBasket, removeItem, id }) {

    return (
        <ul className="row">
            <li><input
                type="checkbox"

                onClick={() => inBasket(item.id, item.name, item.inBasketStatus)}
            />
            </li>
            <li>{item.name}</li>
            <li>
                <button
                    onClick={() => removeItem(item.id)}
                >
                    x
                </button>
            </li>
        </ul >
    )
}

function CreateItem({ addItem }) {
    const [value, setValue] = useState("")

    const handleSubmit = e => {
        e.preventDefault();

        if (!value) return;

        addItem(value);
        setValue("");
    }

    return (
        <form action="submit"
            className="align-center"
            onSubmit={handleSubmit}>
            <input
                type="text"
                value={value}
                placeholder="Add new item"
                onChange={e => setValue(e.target.value)}
            />
        </form>
    )
}


export default function Items() {

    const [items, setItems] = useState([])

    useEffect(() => {
        const ref = base
            .collection("items")
            .onSnapshot(
                snapshot => {
                    const newItems = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data()
                    }))
                    setItems(newItems)
                })
        return () => {
            base.removeBinding(ref);
        }
    }, [])

    const addItem = name => {
        const newItem = { name, inBasketStatus: false }
        const newItems = [...items, newItem]
        setItems(newItems)
        base.collection("items").doc().set(newItem)
    }

    const inBasket = (index, itemName, inBasketStatus) => {

        base.collection("items")
            .doc(index)
            .set({
                name: itemName,
                inBasketStatus: !inBasketStatus
            })
        console.log(index, !inBasketStatus)
    }

    const removeItem = index => {

        base.collection("items").doc(index).delete()

    }

    return (
        <div className="grocery-list">
            <h2 className="align-center">Grocery List</h2>
            {
                items.map((item, index) => (
                    <Item
                        item={item}
                        inBasketStatus={item.inBasketStatus}
                        index={item.id}
                        key={index}
                        id={item}
                        removeItem={removeItem}
                        inBasket={inBasket}
                    />
                )
                )
            }
            <CreateItem
                addItem={addItem}
            />
        </div>
    )
}
