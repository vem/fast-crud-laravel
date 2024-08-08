<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminPermission;
use App\Models\AdminRole;
use App\Models\AdminUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    public function login(Request $request): JsonResponse
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

    public function mine(): JsonResponse
    {
        $token = request()->header('Authorization');

        if (!$token) {
            return response()->json([
                'code' => 1,
                'msg'  => 'Token not found',
            ]);
        }

        // SSL 解密 token
        $token = openssl_decrypt($token, 'AES-256-CBC', env('APP_KEY'), 0, env('APP_IV'));
        $token = json_decode($token, true);

        if (!$token) {
            return response()->json([
                'code' => 1,
                'msg'  => 'Invalid token',
            ]);
        }

        if ($token['expire'] < time()) {
            return response()->json([
                'code' => 1,
                'msg'  => 'Token expired',
            ]);
        }

        $adminUser = AdminUser::where('username', $token['username'])->first();

        if (!$adminUser) {
            return response()->json([
                'code' => 1,
                'msg'  => 'User not found',
            ]);
        }

        return response()->json([
            'code' => 0,
            'data' => [
                'username' => $adminUser->username,
                'nickname' => $adminUser->nickname,
                'avatar'   => $adminUser->avatar,
            ],
        ]);
    }

    public function permissions(): JsonResponse
    {
        $token = request()->header('Authorization');

        if (!$token) {
            return response()->json([
                'code' => 1,
                'msg'  => 'Token not found',
            ]);
        }

        // SSL 解密 token
        $token = openssl_decrypt($token, 'AES-256-CBC', env('APP_KEY'), 0, env('APP_IV'));
        $token = json_decode($token, true);

        if (!$token) {
            return response()->json([
                'code' => 1,
                'msg'  => 'Invalid token',
            ]);
        }

        if ($token['expire'] < time()) {
            return response()->json([
                'code' => 1,
                'msg'  => 'Token expired',
            ]);
        }

        $adminUser = AdminUser::where('username', $token['username'])->first();

        if (!$adminUser) {
            return response()->json([
                'code' => 1,
                'msg'  => 'User not found',
            ]);
        }

        $adminRoleIds = json_decode($adminUser->roles) ?? [];
        if (empty($adminRoleIds)) {
            return response()->json([
                'code' => 1,
                'msg'  => 'No roles',
            ]);
        }

        $adminRoles            = AdminRole::where('active', 'yes')->whereIn('id', $adminRoleIds)->get();
        $adminPermissionIdList = ['trickId'];
        foreach ($adminRoles as $adminRole) {
            $adminPermissionIdList = array_merge($adminPermissionIdList, json_decode($adminRole->permissionIds));
        }
        $adminPermissionIdList = array_unique($adminPermissionIdList);

        $adminPermissionList = AdminPermission::whereIn('id', $adminPermissionIdList)->get();

        return response()->json([
            'code' => 0,
            'data' => $adminPermissionList,
        ]);
    }

    public function getList(): JsonResponse
    {
        $page   = request('page');
        $limit  = $page['limit'] ?? 10;
        $offset = $page['offset'] ?? 0;
        $list   = AdminUser::paginate($limit, ['*'], 'page', $offset);

        return response()->json([
            'code' => 0,
            'data' => [
                'limit'   => $limit,
                'offset'  => $offset,
                'records' => $list->items(),
                'total'   => $list->total(),
            ],
        ]);
    }

    public function store(): JsonResponse
    {
        $data = request()->all();
        $id   = $data['id'] ?? null;

        try {
            AdminUser::updateOrCreate(['id' => $id], $data);
            return response()->json(['code' => 0]);
        } catch (\Exception $e) {
            // 操作失败，处理失败情况
            $errorMessage = $e->getMessage();
            // 可以记录错误日志或返回错误信息
            Log::error('Update or create failed: ' . $errorMessage);
            return response()->json([
                'code' => 1,
                'msg'  => 'Update or create failed: ' . $errorMessage,
            ]);
        }
    }

    public function delete(): JsonResponse
    {
        AdminUser::destroy(request('id'));
        return response()->json(['code' => 0]);
    }
}
