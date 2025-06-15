import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('user', (table) => {
    table.increments('id').primary();
    table.string('username', 32).unique().notNullable();
    table.string('password', 255).notNullable();
    table.string('avatar', 50).nullable();
    table.string('email', 255).nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('user');
}