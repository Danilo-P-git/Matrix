<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            'stats module',
            'activity tracker module',
            'user module',
            'permissions module',
            'payments module',
            'presence tracker',
            'activities module',


        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }



        // Create roles and assign existing permissions
                // Create roles and assign existing permissions
        $superAdminRole = Role::firstOrCreate(['name' => 'super-admin']);
        $superAdminRole->givePermissionTo(Permission::all());
        $adminRole = Role::firstOrCreate(['name' => 'instructor']);
        $adminRole->givePermissionTo([
            'activity tracker module',
            'presence tracker',
            'activities module'
        ]);


        $userRole = Role::firstOrCreate(['name' => 'user']);
        $userRole->givePermissionTo(['activities module']); // Basic permissions for users

        $superAdminUser = User::firstOrCreate(
            ['email' => 'superadmin@matrix.com'],
            [
                'name' => 'Super Admin',
                'password' => bcrypt('superadmin'),
            ]
        );
        $superAdminUser->assignRole('super-admin');
        // Create admin user if doesn't exist
        $adminUser = User::firstOrCreate(
            ['email' => 'admin@matrix.com'],
            [
                'name' => 'Admin User',
                'password' => bcrypt('password123'),
            ]
        );
        $adminUser->assignRole('instructor');

        // Create regular user if doesn't exist
        $regularUser = User::firstOrCreate(
            ['email' => 'user@matrix.com'],
            [
                'name' => 'Regular User',
                'password' => bcrypt('password123'),
            ]
        );
        $regularUser->assignRole('user');
    }
}
