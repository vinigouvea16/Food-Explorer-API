exports.up = knex => knex.schema.createTable("orders", table => {
  table.increments("id").primary()
  
  table.integer("user_id").references("id").inTable("users")
  table.integer("dish_id").references("id").inTable("dishes")
  table.integer("amount")
  table.text("status")

  table.timestamp("created_at").default(knex.fn.now())
  table.timestamp("updated_at").default(knex.fn.now())

});

exports.down = knex =>  knex.schema.dropTable("orders");