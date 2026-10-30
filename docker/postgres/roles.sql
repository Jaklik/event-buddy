-- Databázové role aplikace. Spouští se jako superuživatel připojený k cílové databázi:
--   * při prvním vytvoření databáze v kontejneru postgres (mountuje se do /docker-entrypoint-initdb.d),
--   * v testech (apps/api/test/global-setup.ts), aby se ověřila stejná oprávnění jako v produkci.
-- Hesla a název databáze se čtou z prostředí procesu psql, nikdy z argumentů příkazové řádky.
--
-- selfplan_migrator: vlastní databázi a schéma, smí DDL. Používá ho jen úloha migrate.
-- selfplan_app:      smí jen čtení a zápis dat. Používá ho API, takže případná SQL injekce
--                    nemůže měnit schéma, číst systémové tabulky ani spouštět příkazy na serveru.
\getenv db POSTGRES_DB
\getenv migrator_pw DB_MIGRATOR_PASSWORD
\getenv app_pw DB_APP_PASSWORD
\set migrator selfplan_migrator
\set app selfplan_app

CREATE ROLE :"migrator" LOGIN PASSWORD :'migrator_pw';
CREATE ROLE :"app" LOGIN PASSWORD :'app_pw';

ALTER DATABASE :"db" OWNER TO :"migrator";
REVOKE ALL ON DATABASE :"db" FROM PUBLIC;
GRANT CONNECT ON DATABASE :"db" TO :"app";
-- Ve výchozím stavu se k systémovým databázím může připojit kdokoli (PUBLIC); aplikační role nemá proč.
REVOKE CONNECT ON DATABASE postgres FROM PUBLIC;
REVOKE CONNECT ON DATABASE template1 FROM PUBLIC;

REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO :"migrator";
GRANT USAGE ON SCHEMA public TO :"app";

-- Tabulky a sekvence vytvořené migracemi automaticky dostanou práva pro aplikaci.
ALTER DEFAULT PRIVILEGES FOR ROLE :"migrator" IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO :"app";
ALTER DEFAULT PRIVILEGES FOR ROLE :"migrator" IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO :"app";

-- Dlouhé dotazy a viset v transakci aplikaci neblokují databázi.
ALTER ROLE :"app" SET statement_timeout = '30s';
ALTER ROLE :"app" SET idle_in_transaction_session_timeout = '60s';
