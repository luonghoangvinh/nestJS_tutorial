import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1785919114658 implements MigrationInterface {
    name = 'InitialSchema1785919114658'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "fk_comment_user"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "fk_comment_article"`);
        await queryRunner.query(`ALTER TABLE "follows" DROP CONSTRAINT "follows_follower_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "follows" DROP CONSTRAINT "follows_following_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "articles" DROP CONSTRAINT "fk_articles_user"`);
        await queryRunner.query(`ALTER TABLE "follows" DROP CONSTRAINT "follows_check"`);
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "created_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "follows" DROP CONSTRAINT "follows_pkey"`);
        await queryRunner.query(`ALTER TABLE "follows" ADD CONSTRAINT "follows_pkey" PRIMARY KEY ("following_id")`);
        await queryRunner.query(`ALTER TABLE "follows" DROP COLUMN "follower_id"`);
        await queryRunner.query(`ALTER TABLE "follows" ADD "follower_id" bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "follows" DROP CONSTRAINT "follows_pkey"`);
        await queryRunner.query(`ALTER TABLE "follows" ADD CONSTRAINT "follows_pkey" PRIMARY KEY ("following_id", "follower_id")`);
        await queryRunner.query(`ALTER TABLE "follows" DROP CONSTRAINT "follows_pkey"`);
        await queryRunner.query(`ALTER TABLE "follows" ADD CONSTRAINT "PK_54b5dc2739f2dea57900933db66" PRIMARY KEY ("follower_id")`);
        await queryRunner.query(`ALTER TABLE "follows" DROP COLUMN "following_id"`);
        await queryRunner.query(`ALTER TABLE "follows" ADD "following_id" bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "follows" DROP CONSTRAINT "PK_54b5dc2739f2dea57900933db66"`);
        await queryRunner.query(`ALTER TABLE "follows" ADD CONSTRAINT "PK_8109e59f691f0444b43420f6987" PRIMARY KEY ("follower_id", "following_id")`);
        await queryRunner.query(`ALTER TABLE "follows" ALTER COLUMN "created_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "follows" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "created_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "updated_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "articles" ALTER COLUMN "created_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "articles" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "articles" ALTER COLUMN "updated_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "articles" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "follows" ADD CONSTRAINT "UQ_8109e59f691f0444b43420f6987" UNIQUE ("follower_id", "following_id")`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_4c675567d2a58f0b07cef09c13d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_e9b498cca509147e73808f9e593" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "follows" ADD CONSTRAINT "FK_54b5dc2739f2dea57900933db66" FOREIGN KEY ("follower_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "follows" ADD CONSTRAINT "FK_c518e3988b9c057920afaf2d8c0" FOREIGN KEY ("following_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "articles" ADD CONSTRAINT "FK_87bb15395540ae06337a486a77a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" DROP CONSTRAINT "FK_87bb15395540ae06337a486a77a"`);
        await queryRunner.query(`ALTER TABLE "follows" DROP CONSTRAINT "FK_c518e3988b9c057920afaf2d8c0"`);
        await queryRunner.query(`ALTER TABLE "follows" DROP CONSTRAINT "FK_54b5dc2739f2dea57900933db66"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_e9b498cca509147e73808f9e593"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_4c675567d2a58f0b07cef09c13d"`);
        await queryRunner.query(`ALTER TABLE "follows" DROP CONSTRAINT "UQ_8109e59f691f0444b43420f6987"`);
        await queryRunner.query(`ALTER TABLE "articles" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "articles" ALTER COLUMN "updated_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "articles" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "articles" ALTER COLUMN "created_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "updated_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "created_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "follows" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "follows" ALTER COLUMN "created_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "follows" DROP CONSTRAINT "PK_8109e59f691f0444b43420f6987"`);
        await queryRunner.query(`ALTER TABLE "follows" ADD CONSTRAINT "PK_54b5dc2739f2dea57900933db66" PRIMARY KEY ("follower_id")`);
        await queryRunner.query(`ALTER TABLE "follows" DROP COLUMN "following_id"`);
        await queryRunner.query(`ALTER TABLE "follows" ADD "following_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "follows" DROP CONSTRAINT "PK_54b5dc2739f2dea57900933db66"`);
        await queryRunner.query(`ALTER TABLE "follows" ADD CONSTRAINT "follows_pkey" PRIMARY KEY ("following_id", "follower_id")`);
        await queryRunner.query(`ALTER TABLE "follows" DROP CONSTRAINT "follows_pkey"`);
        await queryRunner.query(`ALTER TABLE "follows" ADD CONSTRAINT "follows_pkey" PRIMARY KEY ("following_id")`);
        await queryRunner.query(`ALTER TABLE "follows" DROP COLUMN "follower_id"`);
        await queryRunner.query(`ALTER TABLE "follows" ADD "follower_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "follows" DROP CONSTRAINT "follows_pkey"`);
        await queryRunner.query(`ALTER TABLE "follows" ADD CONSTRAINT "follows_pkey" PRIMARY KEY ("follower_id", "following_id")`);
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "created_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "follows" ADD CONSTRAINT "follows_check" CHECK ((follower_id <> following_id))`);
        await queryRunner.query(`ALTER TABLE "articles" ADD CONSTRAINT "fk_articles_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "follows" ADD CONSTRAINT "follows_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "follows" ADD CONSTRAINT "follows_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "fk_comment_article" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "fk_comment_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
