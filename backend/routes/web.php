<?php

use App\Http\Controllers\Admin\CRUDController;
use App\Http\Controllers\Admin\PermissionController as AdminPermissionController;
use App\Http\Controllers\Admin\RoleController as AdminRoleController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::post('login', [AdminUserController::class, 'login'])->withoutMiddleware(['web', 'csrf']);

Route::prefix('sys')->withoutMiddleware(['web', 'csrf'])->middleware('auth:sanctum')->group(function () {
    Route::prefix('authority')->group(function () {
        Route::prefix('permission')->controller(AdminPermissionController::class)->group(function () {
            Route::post('tree', 'tree');
            Route::post('add', 'store');
            Route::post('update', 'store');
            Route::post('delete', 'delete');
        });
        Route::prefix('role')->controller(AdminRoleController::class)->group(function () {
            Route::post('page', 'getList');
            Route::post('list', 'getDict');
            Route::post('info', 'getInfo');
            Route::post('add', 'store');
            Route::post('update', 'store');
            Route::post('delete', 'delete');
            Route::post('getPermissionIds', 'getPermissionIds');
            Route::post('authz', 'authz');
        });
        Route::prefix('user')->controller(AdminUserController::class)->group(function () {
            Route::post('page', 'getList');
            Route::post('info', 'getInfo');
            Route::post('add', 'store');
            Route::post('update', 'store');
            Route::post('delete', 'delete');
            Route::post('mine', 'mine');
            Route::post('permissions', 'permissions');
        });
    });

    Route::prefix('crud/{resource}')->controller(CRUDController::class)->group(function () {
        Route::get('page', 'getList'); // 列表
        Route::post('info', 'getInfo'); // 详情
        Route::post('dict', 'getDict'); // 字典
        Route::post('add', 'store'); // 添加
        Route::post('update', 'store'); // 修改
        Route::post('delete', 'delete'); // 删除
        Route::post('upload', 'upload'); // 上传
    });
});
