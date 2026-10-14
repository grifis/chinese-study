import adapter from '@sveltejs/adapter-static';
const base = process.env.BASE_PATH ?? '';
if (base && (!base.startsWith('/') || base.endsWith('/'))) {
 throw new Error('BASE_PATH は /repository-name の形式（末尾スラッシュなし）で指定してください');
}
export default {
 kit: {
  adapter: adapter({ pages: 'build', assets: 'build', strict: true }),
  paths: { base, relative: false }
 }
};
