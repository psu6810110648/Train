import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles'; // 1. สร้างกุญแจชื่อ ROLES_KEY
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles); // 2. ใช้กุญแจนี้