using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace ProjectManagementTool.Migrations
{
    public partial class LastModified : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Columns_LongTermGoals_LongTermGoalId",
                table: "Columns");

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "LastModified",
                table: "Projects",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "LastModified",
                table: "LongTermGoals",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "LongTermGoalId",
                table: "Columns",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Columns_LongTermGoals_LongTermGoalId",
                table: "Columns",
                column: "LongTermGoalId",
                principalTable: "LongTermGoals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Columns_LongTermGoals_LongTermGoalId",
                table: "Columns");

            migrationBuilder.DropColumn(
                name: "LastModified",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "LastModified",
                table: "LongTermGoals");

            migrationBuilder.AlterColumn<int>(
                name: "LongTermGoalId",
                table: "Columns",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddForeignKey(
                name: "FK_Columns_LongTermGoals_LongTermGoalId",
                table: "Columns",
                column: "LongTermGoalId",
                principalTable: "LongTermGoals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
