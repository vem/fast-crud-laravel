<?php

namespace App\Http\Controllers\CRUD;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;

class CreateController extends Controller
{
    public function index($table)
    {
        $model = 'App\\Models\\' . ucfirst($table);
        $data  = request()->all();
        $id    = $data['id'] ?? null;

        try {
            $model::updateOrCreate(['id' => $id], $data);
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
}
