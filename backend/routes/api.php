<?php

use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\CRUD\CreateController;
use App\Http\Controllers\CRUD\DeleteController;
use App\Http\Controllers\CRUD\ReadController;
use App\Http\Controllers\CRUD\UpdateController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/login', [AdminUserController::class, 'login']);
Route::post('/sys/authority/user/mine', [AdminUserController::class, 'mine']); //->middleware('auth:sanctum');
Route::post('/sys/authority/user/permissions', [AdminUserController::class, 'permissions']); //->middleware('auth:sanctum');
Route::post('/sys/authority/permission/tree', [AdminUserController::class, 'tree']); //->middleware('auth:sanctum');

Route::prefix('/sys/crud')->group(function () {
    Route::post('{resource}/page', [ReadController::class, 'getList']); // 列表页面
    Route::post('{resource}/info', [ReadController::class, 'getInfo']); // 详情页面
    Route::post('{resource}/dict', [ReadController::class, 'getDict']); // 字典
    Route::post('{resource}/add', [CreateController::class, 'index']); // 添加
    Route::post('{resource}/update', [UpdateController::class, 'index']); // 修改
    Route::post('{resource}/delete', [DeleteController::class, 'index']); // 删除
    Route::post('adminRole/getPermissionIds', [AdminUserController::class, 'getPermissionIds']);
    Route::post('adminRole/authz', [AdminUserController::class, 'authz']);
});
