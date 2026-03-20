import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Socket, io } from 'socket.io-client';
import { AppModule } from '../src/app.module';

describe('这里应该输出e2e测试的websocket的订单列表', () => {
  let app: INestApplication;
  let socket: Socket;
  //启动nestjs
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await app.listen(3333);
  });
  // 测试前建立链接
  beforeEach((done) => {
    socket = io('http://localhost:3333/order', {
      transports: ['websocket'],
    });

    socket.on('connect', done);
  });
  // 测试后关闭链接
  afterAll(() => {
    if (socket.connected) {
      socket.disconnect();
    }
  });
  //关闭应用
  afterAll(async () => {
    await app.close();
  });

  //进行测试
  it('这里应该返回一个websocket订单列表', (done) => {
    socket.emit('get_all_orders');
    socket.on('get_all_orders', (data) => {
      expect(Array.isArray(data)).toBe(true);
      if (data.length > 0) {
        data.forEach((order) => {
          expect(order).toMatchObject({
            id: expect.any(String),
            status: expect.any(String),
            title: expect.any(String),
          });
        });
      }
      done();
    });
  });
  // 测试修改 websocket 中的内容
  it('修改websocket 订单内容', (done) => {
    socket.emit('get_all_orders');
    socket.once('get_all_orders', (orders) => {
      expect(orders.length).toBeGreaterThan(0);
      const targetOrder = orders[0];
      const nextStatus = 'completed';

      socket.emit('update_order_info', {
        id: targetOrder.id,
        status: nextStatus,
      });
      socket.on('update_order_info', (response) => {
        expect(typeof response).toBe('boolean');
        done();
      });
    });
  });

  // 测试 修改完数据后广播 内容刷新列表
  it('当修改数据时，前端重新请求列表', (done) => {
    socket.emit('get_all_orders');
    socket.once('get_all_orders', (orders) => {
      expect(orders.length).toBeGreaterThan(0);
      const targetOrder = orders[0];
      const nextStatus = 'completed';

      socket.emit('update_order_info', {
        id: targetOrder.id,
        status: nextStatus,
      });
      socket.on('update_order_info', (response) => {
        expect(typeof response).toBe('boolean');
      });
    });
    socket.on('order_need_update', (newOrders) => {
      console.log(newOrders);
      done();
    });
  });
});
