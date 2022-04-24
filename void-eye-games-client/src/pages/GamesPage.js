import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <section>
      <aside>
        <section>
          <header>
            <h2>Order by</h2>
          </header>
          <div>
            <input type="radio" value="Name" name="order" checked=""/> Name
            <input type="radio" value="Price" name="order" /> Price
            <input type="radio" value="Plataform" name="order" /> Plataform
          </div>
        </section>
        <section>
          <header>
            <h2>Categories</h2>
          </header>
          <div>
            <label><input type="checkbox" value={category.id} checked={isChecked}/> category.name</label>
          </div>
        </section>
        <section>
          <header>
            <h2>Plataforms</h2>
          </header>
          <div>
            <label><input type="checkbox" value={category.id} checked={isChecked}/> category.name</label>
          </div>
        </section>
      </aside>
      <article className='border-2 m-4'>
        <header>
          <h1 className='text-center'>News</h1>
        </header>
        <hr />
        {gamesItems}
      </article>
    </section>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
