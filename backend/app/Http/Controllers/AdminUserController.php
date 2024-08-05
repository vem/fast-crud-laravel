<?php

namespace App\Http\Controllers;

use App\Models\AdminUser;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only(['username', 'password']);

        // 使用 AdminUser model 查询是否有管理员
        $adminUser = AdminUser::where('username', $credentials['username'])->first();

        if (!$adminUser) {
            return response()->json([
                'code' => 1,
                'msg'  => 'User not found',
            ]);
        }

        if (!password_verify($credentials['password'], $adminUser->password)) {
            return response()->json([
                'code' => 1,
                'msg'  => 'Invalid password',
            ]);
        }

        // 生成 JWT token
        $expire = time() + 3600 * 24 * 7; // 有效期 7 天
        $token  = json_encode([
            'username' => $adminUser->username,
            'expire'   => $expire, // 有效期 7 天
        ]);

        // SSL 加密 token
        $token = openssl_encrypt($token, 'AES-256-CBC', env('APP_KEY'), 0, env('APP_IV'));

        return response()->json([
            'code' => 0,
            'data' => [
                'token'  => $token,
                'expire' => $expire,
            ]]
        );
    }
}
