for (let i = 0; i < 2000; i++) {
  const userId = faker.number.int({ min: 1, max: 1000 });

  db.run(`
    INSERT INTO orders (user_id, status, created_at, total_amount)
    VALUES (?, ?, ?, ?)
  `, [
    userId,
    'completed',
    faker.date.recent().toISOString(),
    0
  ], function () {

    const orderId = this.lastID;
    let total = 0;

    const itemsCount = faker.number.int({ min: 1, max: 5 });

    for (let j = 0; j < itemsCount; j++) {
      const productId = faker.number.int({ min: 1, max: 500 });
      const qty = faker.number.int({ min: 1, max: 3 });
      const price = faker.number.float({ min: 10, max: 1000 });

      total += qty * price;

      db.run(`
        INSERT INTO order_items (order_id, product_id, quantity, unit_price)
        VALUES (?, ?, ?, ?)
      `, [orderId, productId, qty, price]);
    }

    db.run(`
      UPDATE orders SET total_amount = ? WHERE id = ?
    `, [total, orderId]);
  });
}
