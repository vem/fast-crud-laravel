<?php

use App\Http\Controllers\Admin\PermissionController as AdminPermissionController;
use App\Http\Controllers\Admin\RoleController as AdminRoleController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\CRUD\CreateController;
use App\Http\Controllers\CRUD\DeleteController;
use App\Http\Controllers\CRUD\ReadController;
use App\Http\Controllers\CRUD\UpdateController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('login', [AdminUserController::class, 'login']);

Route::prefix('sys')->group(function () {
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

    Route::prefix('crud')->group(function () {
        Route::post('{resource}/page', [ReadController::class, 'getList']); // 列表页面
        Route::post('{resource}/info', [ReadController::class, 'getInfo']); // 详情页面
        Route::post('{resource}/dict', [ReadController::class, 'getDict']); // 字典
        Route::post('{resource}/add', [CreateController::class, 'index']); // 添加
        Route::post('{resource}/update', [UpdateController::class, 'index']); // 修改
        Route::post('{resource}/delete', [DeleteController::class, 'index']); // 删除
    });
});
