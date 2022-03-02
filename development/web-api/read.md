
#alter this script when you have issue mySQL connection
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'asdfghjk'

#start mysql server
sudo mysqld stop
sudo mysql.server start

#for migration typeorm   
#cmd :  typeorm migration:create -n PostRefactoring
 PostRefactoring is the name of the migration - you can specify any name you want. After you run the command you can see a new file generated in the "migration" directory named {TIMESTAMP}-PostRefactoring.ts where {TIMESTAMP} is the current timestamp when the migration was generated


# npx ts-node ./node_modules/.bin/typeorm/ migration:create -n Test2
# ts-node ./node_modules/.bin/typeorm/ migration:create -n Test2
 will create .ts files. The 

export class Test21559320065425 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE booking.tblUser ADD COLUMN organization3 varchar(100)`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}



 #  npx ts-node ./node_modules/.bin/typeorm/ migration:run
and 
 #  npx ts-node ./node_modules/.bin/typeorm/ migration:revert 
 commands only work on .js files. Thus the typescript files need to be compiled before running the commands. Alternatively you can use ts-node in conjunction with typeorm to run .ts migration files.
# ts-node ./node_modules/typeorm/cli.js migration:run

#note : done forget remove migration script ts after done operation


--------------------- session module ----------
note : make sure you install redis server in the server
#cmd : npm install connect-redis express-session