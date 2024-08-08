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

        $token = $adminUser->createToken('authToken')->plainTextToken;

        return response()->json([
            'code' => 0,
            'data' => [
                'token' => $token,
            ],
        ]);
    }

    public function mine(): JsonResponse
    {
        return response()->json([
            'code' => 0,
            'data' => request()->user()->only(['username', 'nickName', 'avatar']),
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

    private function checkAndHashPassword(string $password): string
    {
        if (strlen($password) < 6) {
            throw new \Exception('Password must be at least 6 characters');
        }

        return password_hash($password, PASSWORD_DEFAULT);
    }

    public function store(): JsonResponse
    {
        $data = request()->all();
        $id   = $data['id'] ?? null;

        try {
            if (isset($data['password']) && $data['password']) {
                $data['password'] = $this->checkAndHashPassword($data['password']);
            } else {
                unset($data['password']);
            }
            AdminUser::updateOrCreate(['id' => $id], $data);
            return response()->json(['code' => 0]);
        } catch (\Exception $e) {
            $errorMessage = $e->getMessage();
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
