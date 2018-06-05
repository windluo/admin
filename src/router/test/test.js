
// 测试组件
const test_1 = resolve => require.ensure([], () => {resolve(require('@/views/test/test_1'))}, 'test_1');
const test_2 = resolve => require.ensure([], () => {resolve(require('@/views/test/test_2'))}, 'test_2');
const test_2_purity = resolve => require.ensure([], () => {resolve(require('@/views/test/test_2_purity'))}, 'test_2_purity');
import Template from '@/common/components/CommonTemplate.vue';
let testObj = [
  // 案例测试
  {
    path: '/demo',
    component: Template,
    children: [
      {
        path: 'test-1',
        name: 'test-1',
        component: test_1
      },
      {
        path: 'test-2',
        name: 'test-2',
        component: test_2
      },
      {
        path: 'test-2-purity',
        name: 'test-2-purity',
        component: test_2_purity
      },
    ]
  }
];

export default testObj;
