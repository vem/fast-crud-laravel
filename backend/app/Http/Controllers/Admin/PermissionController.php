<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminPermission;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class PermissionController extends Controller
{
    // 获取所有权限列表树
    // TODO 根据 Token 返回用户权限列表
    public function tree(): JsonResponse
    {
        function getTree($parentId = -1)
        {
            $adminPermissionList = AdminPermission::where('parentId', $parentId)->orderBy('sort', 'desc')->get();
            foreach ($adminPermissionList as $key => $value) {
                $adminPermissionList[$key]['children'] = getTree($value['id']);
            }
            return $adminPermissionList;
        }
        return $this->response('success', getTree());
    }

    public function store(): JsonResponse
    {
        $data = request()->all();
        $id   = $data['id'] ?? null;

        try {
            AdminPermission::updateOrCreate(['id' => $id], $data);
            return $this->response();
        } catch (\Exception $e) {
            // 操作失败，处理失败情况
            $errorMessage = $e->getMessage();
            // 可以记录错误日志或返回错误信息
            Log::error('Update or create failed: ' . $errorMessage);
            return $this->response('Update or create failed: ' . $errorMessage);
        }
    }

    public function delete(): JsonResponse
    {
        AdminPermission::destroy(request('id'));
        return $this->response();
    }
}
