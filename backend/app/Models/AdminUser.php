<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class AdminUser extends Authenticatable
{
    use HasApiTokens, SoftDeletes;

    protected $table = 'admin_users';

    protected $fillable = [
        'username', 'password', 'nickName', 'avatar', 'roles', 'remark',
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];
}
