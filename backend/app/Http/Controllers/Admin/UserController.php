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
        $credentials = $request->validate([
            'username' => ['required'],
            'password' => ['required'],
        ]);

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

        $expire = time() + 3600 * 24 * 7; // 有效期 7 天
        $token  = $adminUser->createToken('authToken')->plainTextToken;

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
        $user = request()->user();
        return response()->json([
            'code' => 0,
            'data' => [
                'username' => $user->username,
                'nickname' => $user->nickname,
                'avatar'   => $user->avatar,
            ],
        ]);
    }

    public function permissions(): JsonResponse
    {
        $user         = request()->user();
        $adminRoleIds = json_decode($user->roles) ?? [];
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
