.PHONY: setup up install seed test package down reset logs nextcloud35 postgres sqlite

setup:
	composer install
	pnpm install --no-frozen-lockfile
	pnpm build

up:
	docker compose up -d db redis nextcloud34 cron

install:
	bash ./scripts/install.sh nextcloud34

seed:
	docker compose exec -T -u www-data nextcloud34 php occ shortlinks:seed --user=alice

test:
	composer test:all
	pnpm test:all

package:
	pnpm build
	bash ./scripts/package.sh

nextcloud35:
	docker compose --profile nextcloud35 up -d nextcloud35

postgres:
	docker compose --profile postgres up -d nextcloud-postgres

sqlite:
	docker compose --profile sqlite up -d nextcloud-sqlite

logs:
	docker compose logs -f nextcloud34 cron

down:
	docker compose down

reset:
	bash ./scripts/reset.sh
