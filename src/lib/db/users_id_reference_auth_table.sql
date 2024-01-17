alter table "users"
add constraint "users_id_auth_users_id_fk" foreign key ("id") references "auth"."users" ("id") on delete cascade on update cascade;