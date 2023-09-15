exports.up = knex => knex.schema.createTable("order_details", table => {
  table.increments('id').primary();
    table.integer('order_id').unsigned().notNullable();
    table.integer('dish_id').unsigned().notNullable();
    table.integer('quantity').notNullable();
    table.decimal('price', 10, 2).notNullable();

    table.foreign('order_id').references('id').inTable('orders');
    table.foreign('dish_id').references('id').inTable('dishes');
});

exports.down = knex =>  knex.schema.dropTable("order_details");