import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema21786869463779 implements MigrationInterface {
    name = 'InitialSchema21786869463779'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "comments" ("id" BIGSERIAL NOT NULL, "user_id" bigint NOT NULL, "article_id" bigint NOT NULL, "comment" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "follows" ("follower_id" bigint NOT NULL, "following_id" bigint NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8109e59f691f0444b43420f6987" UNIQUE ("follower_id", "following_id"), CONSTRAINT "PK_8109e59f691f0444b43420f6987" PRIMARY KEY ("follower_id", "following_id"))`);
        await queryRunner.query(`CREATE TABLE "favorites" ("user_id" bigint NOT NULL, "article_id" bigint NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a9e152dd51d71f08637b6a9ca00" PRIMARY KEY ("user_id", "article_id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" BIGSERIAL NOT NULL, "username" character varying(100) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "avatar" text, "bio" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "articles" ("id" BIGSERIAL NOT NULL, "user_id" bigint NOT NULL, "title" character varying(255) NOT NULL, "description" text, "content" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0a6e2c450d83e0b6052c2793334" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_4c675567d2a58f0b07cef09c13d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_e9b498cca509147e73808f9e593" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "follows" ADD CONSTRAINT "FK_54b5dc2739f2dea57900933db66" FOREIGN KEY ("follower_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "follows" ADD CONSTRAINT "FK_c518e3988b9c057920afaf2d8c0" FOREIGN KEY ("following_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorites" ADD CONSTRAINT "FK_35a6b05ee3b624d0de01ee50593" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorites" ADD CONSTRAINT "FK_0d2b1e08e4e234e10a0e5ff5fc5" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "articles" ADD CONSTRAINT "FK_87bb15395540ae06337a486a77a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" DROP CONSTRAINT "FK_87bb15395540ae06337a486a77a"`);
        await queryRunner.query(`ALTER TABLE "favorites" DROP CONSTRAINT "FK_0d2b1e08e4e234e10a0e5ff5fc5"`);
        await queryRunner.query(`ALTER TABLE "favorites" DROP CONSTRAINT "FK_35a6b05ee3b624d0de01ee50593"`);
        await queryRunner.query(`ALTER TABLE "follows" DROP CONSTRAINT "FK_c518e3988b9c057920afaf2d8c0"`);
        await queryRunner.query(`ALTER TABLE "follows" DROP CONSTRAINT "FK_54b5dc2739f2dea57900933db66"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_e9b498cca509147e73808f9e593"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_4c675567d2a58f0b07cef09c13d"`);
        await queryRunner.query(`DROP TABLE "articles"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "favorites"`);
        await queryRunner.query(`DROP TABLE "follows"`);
        await queryRunner.query(`DROP TABLE "comments"`);
    }

}
