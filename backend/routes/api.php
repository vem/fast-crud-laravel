<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminUserController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/login', [AdminUserController::class, 'login']);
Route::post('/sys/authority/user/mine', [AdminUserController::class, 'mine']); //->middleware('auth:sanctum');
