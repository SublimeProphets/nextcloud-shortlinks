import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = { scenarios: { redirect: { executor: 'constant-vus', vus: Number(__ENV.VUS || 10), duration: __ENV.DURATION || '30s' } }, thresholds: { http_req_failed: ['rate<0.01'], http_req_duration: ['p(95)<1000'] } }
export default function () { const response = http.get(`${__ENV.BASE_URL}/index.php/apps/shortlinks/r/${__ENV.SLUG}`, { redirects: 0 }); check(response, { 'redirect returned': r => [301, 302, 307, 308].includes(r.status) }); sleep(0.1) }
