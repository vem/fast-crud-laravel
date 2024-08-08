<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminRole;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class RoleController extends Controller
{
    public function getList(): JsonResponse
    {
        $page   = request('page');
        $limit  = $page['limit'] ?? 10;
        $offset = $page['offset'] ?? 0;
        $list   = AdminRole::paginate($limit, ['*'], 'page', $offset);

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

    public function getDict(): JsonResponse
    {
        return response()->json([
            'code' => 0,
            'data' => AdminRole::all(),
        ]);
    }

    public function store(): JsonResponse
    {
        $data = request()->all();
        $id   = $data['id'] ?? null;

        try {
            AdminRole::updateOrCreate(['id' => $id], $data);
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
        AdminRole::destroy(request('id'));
        return response()->json(['code' => 0]);
    }

    public function getPermissionIds(): JsonResponse
    {
        $id        = request('id');
        $adminRole = AdminRole::find($id);

        if (!$adminRole) {
            return response()->json([
                'code' => 1,
                'msg'  => 'Role not found',
            ]);
        }

        return response()->json([
            'code' => 0,
            'data' => json_decode($adminRole->permissionIds ?? '[]'),
        ]);
    }

    public function authz(): JsonResponse
    {
        $id                       = request('roleId');
        $permissionIds            = request('permissionIds');
        $adminRole                = AdminRole::find($id);
        $adminRole->permissionIds = json_encode($permissionIds);
        $adminRole->save();

        return response()->json([
            'code' => 0,
            'msg'  => 'Success',
        ]);
    }
}
