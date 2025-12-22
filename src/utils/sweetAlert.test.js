/** @jest-environment jsdom */

jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
}));

import Swal from 'sweetalert2';
import { SweetAlertUtils } from './sweetAlert';

test('sweetalert smoke: success forwards to Swal.fire and returns result', async () => {
  Swal.fire.mockResolvedValue({ isConfirmed: true });
  const res = await SweetAlertUtils.success();
  expect(Swal.fire).toHaveBeenCalled();
  expect(res).toEqual({ isConfirmed: true });
});
