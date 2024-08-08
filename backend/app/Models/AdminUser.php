<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AdminUser extends Model
{
    use SoftDeletes;

    protected $table = 'admin_users';

    protected $fillable = [
        'username', 'password', 'nickName', 'avatar', 'roles', 'remark',
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];
}
