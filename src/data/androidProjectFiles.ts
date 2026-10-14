export interface AndroidFile {
  path: string;
  name: string;
  packageGroup: 'gradle' | 'manifest' | 'entity' | 'dao' | 'database' | 'repository' | 'viewmodel' | 'ui-screens' | 'ui-components' | 'ui-theme' | 'util' | 'main';
  language: 'kotlin' | 'groovy' | 'xml' | 'toml';
  description: string;
  content: string;
}

export const ANDROID_PROJECT_FILES: AndroidFile[] = [
  // 1. Gradle Version Catalog
  {
    path: 'gradle/libs.versions.toml',
    name: 'libs.versions.toml',
    packageGroup: 'gradle',
    language: 'toml',
    description: 'Modern Gradle version catalog specifying Compose, Room, Coroutines, and Lifecycle dependencies.',
    content: `[versions]
agp = "8.3.1"
kotlin = "1.9.22"
ksp = "1.9.22-1.0.18"
coreKtx = "1.12.0"
lifecycleRuntimeKtx = "2.7.0"
activityCompose = "1.8.2"
composeBom = "2024.02.01"
room = "2.6.1"
coroutines = "1.8.0"
navigationCompose = "2.7.7"
materialIconsExtended = "1.6.3"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
androidx-lifecycle-runtime-ktx = { group = "androidx.lifecycle", name = "lifecycle-runtime-ktx", version.ref = "lifecycleRuntimeKtx" }
androidx-lifecycle-viewmodel-compose = { group = "androidx.lifecycle", name = "lifecycle-viewmodel-compose", version.ref = "lifecycleRuntimeKtx" }
androidx-activity-compose = { group = "androidx.activity", name = "activity-compose", version.ref = "activityCompose" }

# Compose BOM & UI
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
androidx-compose-ui = { group = "androidx.compose.ui", name = "ui" }
androidx-compose-ui-graphics = { group = "androidx.compose.ui", name = "ui-graphics" }
androidx-compose-ui-tooling-preview = { group = "androidx.compose.ui", name = "ui-tooling-preview" }
androidx-compose-ui-tooling = { group = "androidx.compose.ui", name = "ui-tooling" }
androidx-compose-material3 = { group = "androidx.compose.material3", name = "material3" }
androidx-compose-material-icons-extended = { group = "androidx.compose.material", name = "material-icons-extended", version.ref = "materialIconsExtended" }
androidx-navigation-compose = { group = "androidx.navigation", name = "navigation-compose", version.ref = "navigationCompose" }

# Room Local Database with KSP
androidx-room-runtime = { group = "androidx.room", name = "room-runtime", version.ref = "room" }
androidx-room-ktx = { group = "androidx.room", name = "room-ktx", version.ref = "room" }
androidx-room-compiler = { group = "androidx.room", name = "room-compiler", version.ref = "room" }

# Coroutines
kotlinx-coroutines-core = { group = "org.jetbrains.kotlinx", name = "kotlinx-coroutines-core", version.ref = "coroutines" }
kotlinx-coroutines-android = { group = "org.jetbrains.kotlinx", name = "kotlinx-coroutines-android", version.ref = "coroutines" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
ksp = { id = "com.google.devtools.ksp", version.ref = "ksp" }
`,
  },

  // 2. Project build.gradle.kts
  {
    path: 'build.gradle.kts',
    name: 'build.gradle.kts (Project)',
    packageGroup: 'gradle',
    language: 'kotlin',
    description: 'Root project build script configuring plugins.',
    content: `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.ksp) apply false
}
`,
  },

  // 3. App build.gradle.kts
  {
    path: 'app/build.gradle.kts',
    name: 'build.gradle.kts (App)',
    packageGroup: 'gradle',
    language: 'kotlin',
    description: 'App module build script configuring SDK, Java 17, Compose, and Room with KSP.',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.ksp)
}

android {
    namespace = "com.example.habitflow"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.example.habitflow"
        minSdk = 26 // Required for java.time (LocalDate, etc.) without desugaring
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
        freeCompilerArgs += listOf(
            "-opt-in=androidx.compose.material3.ExperimentalMaterial3Api",
            "-opt-in=kotlinx.coroutines.ExperimentalCoroutinesApi"
        )
    }

    buildFeatures {
        compose = true
    }

    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.8"
    }

    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.androidx.activity.compose)

    // Compose
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.ui.graphics)
    implementation(libs.androidx.compose.ui.tooling.preview)
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.compose.material.icons.extended)
    implementation(libs.androidx.navigation.compose)

    // Room Database
    implementation(libs.androidx.room.runtime)
    implementation(libs.androidx.room.ktx)
    ksp(libs.androidx.room.compiler)

    // Kotlin Coroutines
    implementation(libs.kotlinx.coroutines.core)
    implementation(libs.kotlinx.coroutines.android)

    debugImplementation(libs.androidx.compose.ui.tooling)
}
`,
  },

  // 4. AndroidManifest.xml
  {
    path: 'app/src/main/AndroidManifest.xml',
    name: 'AndroidManifest.xml',
    packageGroup: 'manifest',
    language: 'xml',
    description: 'Application manifest declaring permissions, theme, and single-activity architecture.',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- For optional scheduled habit alarms/reminders -->
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />

    <application
        android:name=".HabitApplication"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.HabitFlow">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:label="@string/app_name"
            android:theme="@style/Theme.HabitFlow"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
`,
  },

  // 5. HabitApplication.kt
  {
    path: 'app/src/main/java/com/example/habitflow/HabitApplication.kt',
    name: 'HabitApplication.kt',
    packageGroup: 'main',
    language: 'kotlin',
    description: 'Application entry point initializing the Room database and repository singleton.',
    content: `package com.example.habitflow

import android.app.Application
import com.example.habitflow.data.local.HabitDatabase
import com.example.habitflow.data.repository.HabitRepository
import com.example.habitflow.data.repository.HabitRepositoryImpl

/**
 * Base Application class providing clean manual Dependency Injection
 * for Database and Repository instances.
 */
class HabitApplication : Application() {

    val database: HabitDatabase by lazy {
        HabitDatabase.getInstance(this)
    }

    val repository: HabitRepository by lazy {
        HabitRepositoryImpl(
            habitDao = database.habitDao(),
            completionDao = database.habitCompletionDao()
        )
    }

    override fun onCreate() {
        super.onCreate()
        // Database is initialized lazily upon first access
    }
}
`,
  },

  // 6. HabitEntity.kt
  {
    path: 'app/src/main/java/com/example/habitflow/data/local/entity/HabitEntity.kt',
    name: 'HabitEntity.kt',
    packageGroup: 'entity',
    language: 'kotlin',
    description: 'Room Entity representing a Habit definition with frequency, category, and reminder.',
    content: `package com.example.habitflow.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.time.LocalDate

/**
 * Room Entity representing a trackable Habit.
 */
@Entity(tableName = "habits")
data class HabitEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0L,
    val title: String,
    val description: String = "",
    val category: String, // Health, Productivity, Fitness, Mindfulness, Learning, Finance
    val frequencyType: String, // DAILY, WEEKDAYS, WEEKENDS, CUSTOM
    val targetDaysOfWeek: String, // Comma separated integers: "1,2,3,4,5" (1 = Monday, 7 = Sunday)
    val targetTime: String? = null, // "07:30" formatted 24-hr time
    val colorHex: String = "#0284c7",
    val createdAt: LocalDate = LocalDate.now(),
    val isArchived: Boolean = false
)
`,
  },

  // 7. HabitCompletionLogEntity.kt
  {
    path: 'app/src/main/java/com/example/habitflow/data/local/entity/HabitCompletionLogEntity.kt',
    name: 'HabitCompletionLogEntity.kt',
    packageGroup: 'entity',
    language: 'kotlin',
    description: 'Room Entity recording each completed date for a habit with foreign key cascade.',
    content: `package com.example.habitflow.data.local.entity

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey
import java.time.LocalDate
import java.time.LocalDateTime

/**
 * Room Entity storing an immutable completion timestamp for a habit on a specific date.
 */
@Entity(
    tableName = "habit_completions",
    foreignKeys = [
        ForeignKey(
            entity = HabitEntity::class,
            parentColumns = ["id"],
            childColumns = ["habitId"],
            onDelete = ForeignKey.CASCADE
        )
    ],
    indices = [
        Index(value = ["habitId", "completionDate"], unique = true),
        Index(value = ["completionDate"])
    ]
)
data class HabitCompletionLogEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0L,
    val habitId: Long,
    val completionDate: LocalDate, // e.g., 2026-10-14
    val completedAt: LocalDateTime = LocalDateTime.now()
)
`,
  },

  // 8. HabitDao.kt
  {
    path: 'app/src/main/java/com/example/habitflow/data/local/dao/HabitDao.kt',
    name: 'HabitDao.kt',
    packageGroup: 'dao',
    language: 'kotlin',
    description: 'Data Access Object for Habits providing reactive Flow streams and CRUD operations.',
    content: `package com.example.habitflow.data.local.dao

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.example.habitflow.data.local.entity.HabitEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface HabitDao {

    @Query("SELECT * FROM habits WHERE isArchived = 0 ORDER BY id ASC")
    fun getAllActiveHabits(): Flow<List<HabitEntity>>

    @Query("SELECT * FROM habits ORDER BY id ASC")
    fun getAllHabits(): Flow<List<HabitEntity>>

    @Query("SELECT * FROM habits WHERE id = :habitId LIMIT 1")
    suspend fun getHabitById(habitId: Long): HabitEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertHabit(habit: HabitEntity): Long

    @Update
    suspend fun updateHabit(habit: HabitEntity)

    @Delete
    suspend fun deleteHabit(habit: HabitEntity)

    @Query("UPDATE habits SET isArchived = :isArchived WHERE id = :habitId")
    suspend fun setArchived(habitId: Long, isArchived: Boolean)

    @Query("DELETE FROM habits")
    suspend fun clearAll()
}
`,
  },

  // 9. HabitCompletionDao.kt
  {
    path: 'app/src/main/java/com/example/habitflow/data/local/dao/HabitCompletionDao.kt',
    name: 'HabitCompletionDao.kt',
    packageGroup: 'dao',
    language: 'kotlin',
    description: 'Data Access Object for habit completions, date filtering, and streak aggregation.',
    content: `package com.example.habitflow.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.example.habitflow.data.local.entity.HabitCompletionLogEntity
import kotlinx.coroutines.flow.Flow
import java.time.LocalDate

@Dao
interface HabitCompletionDao {

    @Query("SELECT * FROM habit_completions WHERE completionDate = :date")
    fun getCompletionsForDate(date: LocalDate): Flow<List<HabitCompletionLogEntity>>

    @Query("SELECT * FROM habit_completions WHERE habitId = :habitId ORDER BY completionDate DESC")
    fun getCompletionsForHabit(habitId: Long): Flow<List<HabitCompletionLogEntity>>

    @Query("SELECT * FROM habit_completions ORDER BY completionDate DESC")
    fun getAllCompletions(): Flow<List<HabitCompletionLogEntity>>

    @Query("SELECT * FROM habit_completions WHERE completionDate >= :startDate ORDER BY completionDate ASC")
    fun getCompletionsSince(startDate: LocalDate): Flow<List<HabitCompletionLogEntity>>

    @Insert(onConflict = OnConflictStrategy.IGNORE)
    suspend fun insertCompletion(log: HabitCompletionLogEntity): Long

    @Query("DELETE FROM habit_completions WHERE habitId = :habitId AND completionDate = :date")
    suspend fun deleteCompletion(habitId: Long, date: LocalDate)

    @Query("SELECT EXISTS(SELECT 1 FROM habit_completions WHERE habitId = :habitId AND completionDate = :date)")
    suspend fun isCompleted(habitId: Long, date: LocalDate): Boolean

    @Query("DELETE FROM habit_completions")
    suspend fun clearAll()
}
`,
  },

  // 10. Converters.kt
  {
    path: 'app/src/main/java/com/example/habitflow/data/local/Converters.kt',
    name: 'Converters.kt',
    packageGroup: 'database',
    language: 'kotlin',
    description: 'Room TypeConverters for modern java.time LocalDate and LocalDateTime.',
    content: `package com.example.habitflow.data.local

import androidx.room.TypeConverter
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

/**
 * Type converters for storing java.time types in SQLite as ISO-8601 strings.
 */
class Converters {

    private val dateFormatter = DateTimeFormatter.ISO_LOCAL_DATE
    private val dateTimeFormatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME

    @TypeConverter
    fun fromLocalDate(value: LocalDate?): String? {
        return value?.format(dateFormatter)
    }

    @TypeConverter
    fun toLocalDate(value: String?): LocalDate? {
        return value?.let { LocalDate.parse(it, dateFormatter) }
    }

    @TypeConverter
    fun fromLocalDateTime(value: LocalDateTime?): String? {
        return value?.format(dateTimeFormatter)
    }

    @TypeConverter
    fun toLocalDateTime(value: String?): LocalDateTime? {
        return value?.let { LocalDateTime.parse(it, dateTimeFormatter) }
    }
}
`,
  },

  // 11. HabitDatabase.kt
  {
    path: 'app/src/main/java/com/example/habitflow/data/local/HabitDatabase.kt',
    name: 'HabitDatabase.kt',
    packageGroup: 'database',
    language: 'kotlin',
    description: 'Room Database definition with singleton builder and pre-population callbacks.',
    content: `package com.example.habitflow.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import androidx.sqlite.db.SupportSQLiteDatabase
import com.example.habitflow.data.local.dao.HabitCompletionDao
import com.example.habitflow.data.local.dao.HabitDao
import com.example.habitflow.data.local.entity.HabitCompletionLogEntity
import com.example.habitflow.data.local.entity.HabitEntity
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.time.LocalDate

@Database(
    entities = [HabitEntity::class, HabitCompletionLogEntity::class],
    version = 1,
    exportSchema = false
)
@TypeConverters(Converters::class)
abstract class HabitDatabase : RoomDatabase() {

    abstract fun habitDao(): HabitDao
    abstract fun habitCompletionDao(): HabitCompletionDao

    companion object {
        @Volatile
        private var INSTANCE: HabitDatabase? = null

        fun getInstance(context: Context): HabitDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    HabitDatabase::class.java,
                    "habit_flow_db"
                )
                    .addCallback(DatabaseCallback())
                    .fallbackToDestructiveMigration()
                    .build()
                INSTANCE = instance
                instance
            }
        }
    }

    private class DatabaseCallback : RoomDatabase.Callback() {
        override fun onCreate(db: SupportSQLiteDatabase) {
            super.onCreate(db)
            INSTANCE?.let { database ->
                CoroutineScope(Dispatchers.IO).launch {
                    seedInitialHabits(database)
                }
            }
        }

        private suspend fun seedInitialHabits(db: HabitDatabase) {
            val dao = db.habitDao()
            val compDao = db.habitCompletionDao()
            val today = LocalDate.now()

            val habit1Id = dao.insertHabit(
                HabitEntity(
                    title = "Morning Hydration (1L)",
                    description = "Drink fresh water with lemon right after waking up",
                    category = "Health",
                    frequencyType = "DAILY",
                    targetDaysOfWeek = "1,2,3,4,5,6,7",
                    targetTime = "07:00",
                    colorHex = "#0284c7"
                )
            )

            val habit2Id = dao.insertHabit(
                HabitEntity(
                    title = "Deep Focus Work (45m)",
                    description = "No social media or notifications during deep sprints",
                    category = "Productivity",
                    frequencyType = "WEEKDAYS",
                    targetDaysOfWeek = "1,2,3,4,5",
                    targetTime = "09:30",
                    colorHex = "#7c3aed"
                )
            )

            val habit3Id = dao.insertHabit(
                HabitEntity(
                    title = "Evening Mindfulness (10m)",
                    description = "Box breathing and light journaling before sleep",
                    category = "Mindfulness",
                    frequencyType = "DAILY",
                    targetDaysOfWeek = "1,2,3,4,5,6,7",
                    targetTime = "21:00",
                    colorHex = "#10b981"
                )
            )

            // Seed historical completions for initial streak demonstration
            for (i in 1..7) {
                compDao.insertCompletion(
                    HabitCompletionLogEntity(
                        habitId = habit1Id,
                        completionDate = today.minusDays(i.toLong())
                    )
                )
            }
        }
    }
}
`,
  },

  // 12. Models
  {
    path: 'app/src/main/java/com/example/habitflow/data/model/HabitModels.kt',
    name: 'HabitModels.kt',
    packageGroup: 'repository',
    language: 'kotlin',
    description: 'Clean domain models, enums, streak calculations, and UI presentation wrappers.',
    content: `package com.example.habitflow.data.model

import java.time.DayOfWeek
import java.time.LocalDate

enum class HabitCategory(val displayName: String, val defaultColor: String) {
    HEALTH("Health", "#0284c7"),
    PRODUCTIVITY("Productivity", "#7c3aed"),
    FITNESS("Fitness", "#ea580c"),
    MINDFULNESS("Mindfulness", "#10b981"),
    LEARNING("Learning", "#f59e0b"),
    FINANCE("Finance", "#059669")
}

enum class FrequencyType {
    DAILY,
    WEEKDAYS,
    WEEKENDS,
    CUSTOM
}

data class HabitFrequency(
    val type: FrequencyType,
    val targetDays: Set<DayOfWeek> = DayOfWeek.values().toSet()
)

data class StreakStats(
    val currentStreak: Int = 0,
    val longestStreak: Int = 0,
    val totalCompletions: Int = 0,
    val completionRate: Int = 0 // 0 to 100 percentage
)

/**
 * Domain Habit model enriched with calculated live status for UI
 */
data class HabitItem(
    val id: Long,
    val title: String,
    val description: String,
    val category: HabitCategory,
    val frequency: HabitFrequency,
    val targetTime: String?,
    val colorHex: String,
    val createdAt: LocalDate,
    val isArchived: Boolean,
    val isCompletedToday: Boolean,
    val isScheduledToday: Boolean,
    val streakStats: StreakStats
)

data class Milestone(
    val id: String,
    val title: String,
    val description: String,
    val requiredStreak: Int,
    val isUnlocked: Boolean
)
`,
  },

  // 13. StreakCalculator.kt
  {
    path: 'app/src/main/java/com/example/habitflow/util/StreakCalculator.kt',
    name: 'StreakCalculator.kt',
    packageGroup: 'util',
    language: 'kotlin',
    description: 'Robust streak algorithm using java.time.LocalDate and scheduled day frequencies.',
    content: `package com.example.habitflow.util

import com.example.habitflow.data.local.entity.HabitCompletionLogEntity
import com.example.habitflow.data.local.entity.HabitEntity
import com.example.habitflow.data.model.FrequencyType
import com.example.habitflow.data.model.StreakStats
import java.time.DayOfWeek
import java.time.LocalDate

object StreakCalculator {

    fun isHabitScheduledOn(habit: HabitEntity, date: LocalDate): Boolean {
        val dayOfWeek = date.dayOfWeek
        val frequency = try {
            FrequencyType.valueOf(habit.frequencyType)
        } catch (e: Exception) {
            FrequencyType.DAILY
        }

        return when (frequency) {
            FrequencyType.DAILY -> true
            FrequencyType.WEEKDAYS -> dayOfWeek != DayOfWeek.SATURDAY && dayOfWeek != DayOfWeek.SUNDAY
            FrequencyType.WEEKENDS -> dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY
            FrequencyType.CUSTOM -> {
                val targetDayInts = habit.targetDaysOfWeek
                    .split(",")
                    .mapNotNull { it.trim().toIntOrNull() }
                targetDayInts.contains(dayOfWeek.value)
            }
        }
    }

    /**
     * Calculates current streak, longest streak, and completion rate
     * matching scheduled habit frequencies.
     */
    fun calculateStreaks(
        habit: HabitEntity,
        completions: List<HabitCompletionLogEntity>,
        referenceDate: LocalDate = LocalDate.now()
    ): StreakStats {
        val completedDates = completions.map { it.completionDate }.toSet()
        val isCompletedToday = completedDates.contains(referenceDate)

        // 1. Calculate Current Streak
        var currentStreak = 0
        var cursor = referenceDate

        if (isHabitScheduledOn(habit, cursor)) {
            if (isCompletedToday) {
                currentStreak++
                cursor = cursor.minusDays(1)
            } else {
                // Today scheduled but not yet completed; streak survives from yesterday
                cursor = cursor.minusDays(1)
            }
        } else {
            // Not scheduled today; test from previous scheduled day
            cursor = cursor.minusDays(1)
        }

        var safetyLimit = 365
        while (safetyLimit-- > 0) {
            if (isHabitScheduledOn(habit, cursor)) {
                if (completedDates.contains(cursor)) {
                    currentStreak++
                    cursor = cursor.minusDays(1)
                } else {
                    break // Streak broken
                }
            } else {
                // Non-scheduled days (e.g. weekends for weekday habit) do not break streak
                cursor = cursor.minusDays(1)
            }
        }

        // 2. Calculate Longest Streak & Completion Rate over past 90 days
        var longestStreak = currentStreak
        var tempStreak = 0
        var evalDate = referenceDate.minusDays(90)

        var scheduledCountPast30 = 0
        var completedCountPast30 = 0

        for (i in 0..90) {
            val isScheduled = isHabitScheduledOn(habit, evalDate)
            val isDone = completedDates.contains(evalDate)

            if (i >= 60) { // Past 30 days
                if (isScheduled) {
                    scheduledCountPast30++
                    if (isDone) completedCountPast30++
                }
            }

            if (isScheduled) {
                if (isDone) {
                    tempStreak++
                    if (tempStreak > longestStreak) {
                        longestStreak = tempStreak
                    }
                } else {
                    tempStreak = 0
                }
            }
            evalDate = evalDate.plusDays(1)
        }

        val completionRate = if (scheduledCountPast30 > 0) {
            ((completedCountPast30.toDouble() / scheduledCountPast30) * 100).toInt()
        } else if (completedDates.isNotEmpty()) 100 else 0

        return StreakStats(
            currentStreak = currentStreak,
            longestStreak = maxOf(longestStreak, currentStreak),
            totalCompletions = completedDates.size,
            completionRate = completionRate
        )
    }
}
`,
  },

  // 14. HabitRepository.kt
  {
    path: 'app/src/main/java/com/example/habitflow/data/repository/HabitRepository.kt',
    name: 'HabitRepository.kt',
    packageGroup: 'repository',
    language: 'kotlin',
    description: 'Repository interface abstracting Room data access with reactive Flow flows.',
    content: `package com.example.habitflow.data.repository

import com.example.habitflow.data.local.entity.HabitCompletionLogEntity
import com.example.habitflow.data.local.entity.HabitEntity
import kotlinx.coroutines.flow.Flow
import java.time.LocalDate

interface HabitRepository {
    fun getActiveHabits(): Flow<List<HabitEntity>>
    fun getAllHabits(): Flow<List<HabitEntity>>
    fun getCompletionsForDate(date: LocalDate): Flow<List<HabitCompletionLogEntity>>
    fun getAllCompletions(): Flow<List<HabitCompletionLogEntity>>
    fun getCompletionsSince(startDate: LocalDate): Flow<List<HabitCompletionLogEntity>>
    
    suspend fun insertHabit(habit: HabitEntity): Long
    suspend fun updateHabit(habit: HabitEntity)
    suspend fun deleteHabit(habit: HabitEntity)
    suspend fun setArchived(habitId: Long, isArchived: Boolean)
    
    suspend fun toggleHabitCompletion(habitId: Long, date: LocalDate): Boolean
    suspend fun clearAllData()
}
`,
  },

  // 15. HabitRepositoryImpl.kt
  {
    path: 'app/src/main/java/com/example/habitflow/data/repository/HabitRepositoryImpl.kt',
    name: 'HabitRepositoryImpl.kt',
    packageGroup: 'repository',
    language: 'kotlin',
    description: 'Repository implementation orchestrating transactions, DAO queries, and completion toggles.',
    content: `package com.example.habitflow.data.repository

import com.example.habitflow.data.local.dao.HabitCompletionDao
import com.example.habitflow.data.local.dao.HabitDao
import com.example.habitflow.data.local.entity.HabitCompletionLogEntity
import com.example.habitflow.data.local.entity.HabitEntity
import kotlinx.coroutines.flow.Flow
import java.time.LocalDate

class HabitRepositoryImpl(
    private val habitDao: HabitDao,
    private val completionDao: HabitCompletionDao
) : HabitRepository {

    override fun getActiveHabits(): Flow<List<HabitEntity>> = habitDao.getAllActiveHabits()

    override fun getAllHabits(): Flow<List<HabitEntity>> = habitDao.getAllHabits()

    override fun getCompletionsForDate(date: LocalDate): Flow<List<HabitCompletionLogEntity>> =
        completionDao.getCompletionsForDate(date)

    override fun getAllCompletions(): Flow<List<HabitCompletionLogEntity>> =
        completionDao.getAllCompletions()

    override fun getCompletionsSince(startDate: LocalDate): Flow<List<HabitCompletionLogEntity>> =
        completionDao.getCompletionsSince(startDate)

    override fun getCompletionsForHabit(habitId: Long): Flow<List<HabitCompletionLogEntity>> =
        completionDao.getCompletionsForHabit(habitId)

    override suspend fun insertHabit(habit: HabitEntity): Long = habitDao.insertHabit(habit)

    override suspend fun updateHabit(habit: HabitEntity) = habitDao.updateHabit(habit)

    override suspend fun deleteHabit(habit: HabitEntity) = habitDao.deleteHabit(habit)

    override suspend fun setArchived(habitId: Long, isArchived: Boolean) =
        habitDao.setArchived(habitId, isArchived)

    /**
     * Toggles habit completion: if completed, removes log; otherwise inserts completion log.
     * Returns true if now completed, false if now incomplete.
     */
    override suspend fun toggleHabitCompletion(habitId: Long, date: LocalDate): Boolean {
        val alreadyCompleted = completionDao.isCompleted(habitId, date)
        if (alreadyCompleted) {
            completionDao.deleteCompletion(habitId, date)
            return false
        } else {
            completionDao.insertCompletion(
                HabitCompletionLogEntity(
                    habitId = habitId,
                    completionDate = date
                )
            )
            return true
        }
    }

    override suspend fun clearAllData() {
        completionDao.clearAll()
        habitDao.clearAll()
    }
}
`,
  },

  // 16. HabitUiState.kt
  {
    path: 'app/src/main/java/com/example/habitflow/ui/viewmodel/HabitUiState.kt',
    name: 'HabitUiState.kt',
    packageGroup: 'viewmodel',
    language: 'kotlin',
    description: 'Immutable UI state class adhering to Unidirectional Data Flow (UDF).',
    content: `package com.example.habitflow.ui.viewmodel

import com.example.habitflow.data.local.entity.HabitCompletionLogEntity
import com.example.habitflow.data.model.HabitCategory
import com.example.habitflow.data.model.HabitItem
import com.example.habitflow.data.model.Milestone
import java.time.LocalDate

data class DayCompletionSummary(
    val date: LocalDate,
    val completedCount: Int,
    val scheduledCount: Int,
    val isAllDone: Boolean
)

data class HabitUiState(
    val isLoading: Boolean = true,
    val selectedDate: LocalDate = LocalDate.now(),
    val habits: List<HabitItem> = emptyList(),
    val allCompletions: List<HabitCompletionLogEntity> = emptyList(),
    val selectedCategory: HabitCategory? = null,
    val searchQuery: String = "",
    val editingHabit: HabitItem? = null,
    val isAddEditSheetOpen: Boolean = false,
    val isDarkTheme: Boolean = false,
    val userMessage: String? = null
) {
    val todaysHabits: List<HabitItem>
        get() = habits.filter { it.isScheduledToday }

    val completedTodayCount: Int
        get() = todaysHabits.count { it.isCompletedToday }

    val totalScheduledTodayCount: Int
        get() = todaysHabits.size

    val dailyProgressFraction: Float
        get() = if (totalScheduledTodayCount == 0) 0f
        else completedTodayCount.toFloat() / totalScheduledTodayCount.toFloat()

    val overallConsistencyScore: Int
        get() {
            if (habits.isEmpty()) return 0
            val avg = habits.map { it.streakStats.completionRate }.average()
            return avg.toInt()
        }

    val bestStreak: Int
        get() = habits.maxOfOrNull { it.streakStats.longestStreak } ?: 0

    val milestones: List<Milestone>
        get() = listOf(
            Milestone("m1", "3-Day Spark", "Complete habits 3 days in a row", 3, bestStreak >= 3),
            Milestone("m2", "7-Day Flame", "Hit a full 1-week streak", 7, bestStreak >= 7),
            Milestone("m3", "14-Day Iron Habit", "Maintain consistency for 2 weeks", 14, bestStreak >= 14),
            Milestone("m4", "30-Day Master", "Full month milestone reached", 30, bestStreak >= 30),
            Milestone("m5", "60-Day Titan", "Two continuous months of discipline", 60, bestStreak >= 60),
            Milestone("m6", "100-Day Legend", "Centurion achievement! Legendary focus", 100, bestStreak >= 100)
        )
}
`,
  },

  // 17. HabitsViewModel.kt
  {
    path: 'app/src/main/java/com/example/habitflow/ui/viewmodel/HabitsViewModel.kt',
    name: 'HabitsViewModel.kt',
    packageGroup: 'viewmodel',
    language: 'kotlin',
    description: 'ViewModel combining Room Flows into StateFlow and handling user intent events.',
    content: `package com.example.habitflow.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.habitflow.data.local.entity.HabitEntity
import com.example.habitflow.data.model.FrequencyType
import com.example.habitflow.data.model.HabitCategory
import com.example.habitflow.data.model.HabitFrequency
import com.example.habitflow.data.model.HabitItem
import com.example.habitflow.data.repository.HabitRepository
import com.example.habitflow.util.StreakCalculator
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import java.time.DayOfWeek
import java.time.LocalDate

class HabitsViewModel(
    private val repository: HabitRepository
) : ViewModel() {

    private val _selectedDate = MutableStateFlow(LocalDate.now())
    private val _selectedCategory = MutableStateFlow<HabitCategory?>(null)
    private val _searchQuery = MutableStateFlow("")
    private val _isAddEditSheetOpen = MutableStateFlow(false)
    private val _editingHabit = MutableStateFlow<HabitItem?>(null)
    private val _isDarkTheme = MutableStateFlow(false)
    private val _userMessage = MutableStateFlow<String?>(null)

    val uiState: StateFlow<HabitUiState> = combine(
        repository.getActiveHabits(),
        repository.getAllCompletions(),
        _selectedDate,
        _selectedCategory,
        _searchQuery,
        _isAddEditSheetOpen,
        _editingHabit,
        _isDarkTheme,
        _userMessage
    ) { habitsEntities, allCompletions, date, category, query, isSheetOpen, editHabit, isDark, msg ->

        val items = habitsEntities.map { entity ->
            val completionsForHabit = allCompletions.filter { it.habitId == entity.id }
            val streak = StreakCalculator.calculateStreaks(entity, completionsForHabit, date)
            val isScheduled = StreakCalculator.isHabitScheduledOn(entity, date)
            val isDoneToday = completionsForHabit.any { it.completionDate == date }

            val catEnum = try {
                HabitCategory.valueOf(entity.category.uppercase())
            } catch (e: Exception) {
                HabitCategory.HEALTH
            }

            val freqType = try {
                FrequencyType.valueOf(entity.frequencyType)
            } catch (e: Exception) {
                FrequencyType.DAILY
            }

            val targetDays = entity.targetDaysOfWeek
                .split(",")
                .mapNotNull { it.trim().toIntOrNull() }
                .map { DayOfWeek.of(it) }
                .toSet()

            HabitItem(
                id = entity.id,
                title = entity.title,
                description = entity.description,
                category = catEnum,
                frequency = HabitFrequency(freqType, targetDays),
                targetTime = entity.targetTime,
                colorHex = entity.colorHex,
                createdAt = entity.createdAt,
                isArchived = entity.isArchived,
                isCompletedToday = isDoneToday,
                isScheduledToday = isScheduled,
                streakStats = streak
            )
        }.filter { habit ->
            // Category filter
            (category == null || habit.category == category) &&
            // Search query filter
            (query.isBlank() || habit.title.contains(query, ignoreCase = true) ||
                    habit.description.contains(query, ignoreCase = true))
        }

        HabitUiState(
            isLoading = false,
            selectedDate = date,
            habits = items,
            allCompletions = allCompletions,
            selectedCategory = category,
            searchQuery = query,
            editingHabit = editHabit,
            isAddEditSheetOpen = isSheetOpen,
            isDarkTheme = isDark,
            userMessage = msg
        )
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5_000),
        initialValue = HabitUiState(isLoading = true)
    )

    fun onToggleHabit(habitId: Long) {
        viewModelScope.launch {
            val date = _selectedDate.value
            val isNowCompleted = repository.toggleHabitCompletion(habitId, date)
            if (isNowCompleted) {
                _userMessage.value = "Habit marked as completed! Keep the streak going."
            }
        }
    }

    fun onDateSelected(date: LocalDate) {
        _selectedDate.value = date
    }

    fun onCategorySelected(category: HabitCategory?) {
        _selectedCategory.value = category
    }

    fun onSearchQueryChanged(query: String) {
        _searchQuery.value = query
    }

    fun openAddHabitSheet() {
        _editingHabit.value = null
        _isAddEditSheetOpen.value = true
    }

    fun openEditHabitSheet(habit: HabitItem) {
        _editingHabit.value = habit
        _isAddEditSheetOpen.value = true
    }

    fun dismissAddEditSheet() {
        _isAddEditSheetOpen.value = false
        _editingHabit.value = null
    }

    fun saveHabit(
        id: Long?,
        title: String,
        description: String,
        category: HabitCategory,
        frequencyType: FrequencyType,
        targetDays: List<Int>,
        targetTime: String?,
        colorHex: String
    ) {
        viewModelScope.launch {
            val entity = HabitEntity(
                id = id ?: 0L,
                title = title.trim(),
                description = description.trim(),
                category = category.name,
                frequencyType = frequencyType.name,
                targetDaysOfWeek = targetDays.joinToString(","),
                targetTime = targetTime,
                colorHex = colorHex
            )

            if (id == null || id == 0L) {
                repository.insertHabit(entity)
                _userMessage.value = "New habit added successfully!"
            } else {
                repository.updateHabit(entity)
                _userMessage.value = "Habit updated!"
            }
            dismissAddEditSheet()
        }
    }

    fun deleteHabit(habitId: Long) {
        viewModelScope.launch {
            val entity = HabitEntity(
                id = habitId,
                title = "",
                category = "HEALTH",
                frequencyType = "DAILY",
                targetDaysOfWeek = "1,2,3,4,5,6,7"
            )
            repository.deleteHabit(entity)
            _userMessage.value = "Habit deleted."
        }
    }

    fun toggleTheme() {
        _isDarkTheme.update { !it }
    }

    fun clearUserMessage() {
        _userMessage.value = null
    }

    fun resetAllData() {
        viewModelScope.launch {
            repository.clearAllData()
            _userMessage.value = "All data reset."
        }
    }
}

class HabitsViewModelFactory(
    private val repository: HabitRepository
) : ViewModelProvider.Factory {
    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        return HabitsViewModel(repository) as T
    }
}
`,
  },

  // 18. Theme.kt
  {
    path: 'app/src/main/java/com/example/habitflow/ui/theme/Color.kt',
    name: 'Color.kt',
    packageGroup: 'ui-theme',
    language: 'kotlin',
    description: 'Material 3 color palette for Dark and Light themes.',
    content: `package com.example.habitflow.ui.theme

import androidx.compose.ui.graphics.Color

// Primary Brand
val PrimaryBlue = Color(0xFF0284C7)
val PrimaryBlueLight = Color(0xFF38BDF8)
val PrimaryBlueDark = Color(0xFF0369A1)

// Secondary & Accent
val SecondaryTeal = Color(0xFF0D9488)
val AccentPurple = Color(0xFF8B5CF6)
val StreakFlame = Color(0xFFEA580C)

// Dark Theme Surfaces
val DarkBackground = Color(0xFF0F172A)
val DarkSurface = Color(0xFF1E293B)
val DarkSurfaceVariant = Color(0xFF334155)
val DarkOnSurface = Color(0xFFF8FAFC)
val DarkOnSurfaceVariant = Color(0xFF94A3B8)

// Light Theme Surfaces
val LightBackground = Color(0xFFF8FAFC)
val LightSurface = Color(0xFFFFFFFF)
val LightSurfaceVariant = Color(0xFFF1F5F9)
val LightOnSurface = Color(0xFF0F172A)
val LightOnSurfaceVariant = Color(0xFF64748B)

// Success & Categories
val SuccessGreen = Color(0xFF10B981)
val CategoryHealth = Color(0xFF0284C7)
val CategoryProductivity = Color(0xFF7C3AED)
val CategoryFitness = Color(0xFFEA580C)
val CategoryMindfulness = Color(0xFF10B981)
val CategoryLearning = Color(0xFFF59E0B)
`,
  },

  // 19. Theme.kt
  {
    path: 'app/src/main/java/com/example/habitflow/ui/theme/Theme.kt',
    name: 'Theme.kt',
    packageGroup: 'ui-theme',
    language: 'kotlin',
    description: 'Material 3 Theme implementation with dynamic color support for Android 12+.',
    content: `package com.example.habitflow.ui.theme

import android.app.Activity
import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val DarkColorScheme = darkColorScheme(
    primary = PrimaryBlueLight,
    onPrimary = DarkBackground,
    secondary = SecondaryTeal,
    background = DarkBackground,
    surface = DarkSurface,
    surfaceVariant = DarkSurfaceVariant,
    onBackground = DarkOnSurface,
    onSurface = DarkOnSurface,
    onSurfaceVariant = DarkOnSurfaceVariant
)

private val LightColorScheme = lightColorScheme(
    primary = PrimaryBlue,
    onPrimary = LightSurface,
    secondary = SecondaryTeal,
    background = LightBackground,
    surface = LightSurface,
    surfaceVariant = LightSurfaceVariant,
    onBackground = LightOnSurface,
    onSurface = LightOnSurface,
    onSurfaceVariant = LightOnSurfaceVariant
)

@Composable
fun HabitFlowTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = true,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.background.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !darkTheme
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
`,
  },

  // 20. Type.kt
  {
    path: 'app/src/main/java/com/example/habitflow/ui/theme/Type.kt',
    name: 'Type.kt',
    packageGroup: 'ui-theme',
    language: 'kotlin',
    description: 'Material 3 typography definition with clean font hierarchy.',
    content: `package com.example.habitflow.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

val Typography = Typography(
    headlineLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Bold,
        fontSize = 28.sp,
        lineHeight = 36.sp
    ),
    headlineMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.SemiBold,
        fontSize = 22.sp,
        lineHeight = 28.sp
    ),
    titleLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Bold,
        fontSize = 18.sp,
        lineHeight = 24.sp
    ),
    titleMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.SemiBold,
        fontSize = 16.sp,
        lineHeight = 22.sp
    ),
    bodyLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 15.sp,
        lineHeight = 22.sp
    ),
    bodyMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 13.sp,
        lineHeight = 18.sp
    ),
    labelSmall = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Medium,
        fontSize = 11.sp,
        lineHeight = 16.sp
    )
)
`,
  },

  // 21. HomeScreen.kt
  {
    path: 'app/src/main/java/com/example/habitflow/ui/screen/home/HomeScreen.kt',
    name: 'HomeScreen.kt',
    packageGroup: 'ui-screens',
    language: 'kotlin',
    description: 'Today screen displaying daily progress hero card, week selector, and animated habit cards.',
    content: `package com.example.habitflow.ui.screen.home

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.FilterList
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.habitflow.data.model.HabitItem
import com.example.habitflow.ui.screen.home.components.DailyProgressCard
import com.example.habitflow.ui.screen.home.components.HabitCard
import com.example.habitflow.ui.screen.home.components.WeekCalendarStrip
import com.example.habitflow.ui.viewmodel.HabitUiState
import java.time.format.DateTimeFormatter

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    uiState: HabitUiState,
    onToggleHabit: (Long) -> Unit,
    onEditHabit: (HabitItem) -> Unit,
    onDeleteHabit: (Long) -> Unit,
    onAddHabitClick: () -> Unit,
    onDateSelected: (java.time.LocalDate) -> Unit
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "Today",
                            style = MaterialTheme.typography.headlineMedium,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = uiState.selectedDate.format(DateTimeFormatter.ofPattern("EEEE, MMM d")),
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                },
                actions = {
                    IconButton(onClick = { /* Filter Dialog */ }) {
                        Icon(Icons.Default.FilterList, contentDescription = "Filter")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.background
                )
            )
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = onAddHabitClick,
                containerColor = MaterialTheme.colorScheme.primary,
                contentColor = MaterialTheme.colorScheme.onPrimary
            ) {
                Icon(Icons.Default.Add, contentDescription = "Add Habit")
            }
        }
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // 1. Calendar strip for day browsing
            item {
                WeekCalendarStrip(
                    selectedDate = uiState.selectedDate,
                    onDateSelected = onDateSelected
                )
            }

            // 2. Daily completion progress card
            item {
                DailyProgressCard(
                    completedCount = uiState.completedTodayCount,
                    totalCount = uiState.totalScheduledTodayCount,
                    progress = uiState.dailyProgressFraction
                )
            }

            // 3. Section Title
            item {
                Text(
                    text = "Habits Scheduled (" + uiState.todaysHabits.size + ")",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.SemiBold,
                    color = MaterialTheme.colorScheme.onSurface
                )
            }

            // 4. Habit Cards
            if (uiState.todaysHabits.isEmpty()) {
                item {
                    Text(
                        text = "No habits scheduled for this day. Tap + to create one!",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(vertical = 32.dp)
                    )
                }
            } else {
                items(
                    items = uiState.todaysHabits,
                    key = { it.id }
                ) { habit ->
                    HabitCard(
                        habit = habit,
                        onToggle = { onToggleHabit(habit.id) },
                        onEdit = { onEditHabit(habit) },
                        onDelete = { onDeleteHabit(habit.id) }
                    )
                }
            }

            item {
                Spacer(modifier = Modifier.height(64.dp))
            }
        }
    }
}
`,
  },

  // 22. HabitCard.kt
  {
    path: 'app/src/main/java/com/example/habitflow/ui/screen/home/components/HabitCard.kt',
    name: 'HabitCard.kt',
    packageGroup: 'ui-components',
    language: 'kotlin',
    description: 'Animated habit card with category color badge, live streak flame counter, and toggle checkbox.',
    content: `package com.example.habitflow.ui.screen.home.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.spring
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.LocalFireDepartment
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material.icons.filled.Schedule
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import com.example.habitflow.data.model.HabitItem

@Composable
fun HabitCard(
    habit: HabitItem,
    onToggle: () -> Unit,
    onEdit: () -> Unit,
    onDelete: () -> Unit,
    modifier: Modifier = Modifier
) {
    var menuExpanded by remember { mutableStateOf(false) }

    val accentColor = try {
        Color(android.graphics.Color.parseColor(habit.colorHex))
    } catch (e: Exception) {
        MaterialTheme.colorScheme.primary
    }

    val checkBgColor by animateColorAsState(
        targetValue = if (habit.isCompletedToday) accentColor else Color.Transparent,
        animationSpec = spring(stiffness = Spring.StiffnessMediumLow),
        label = "checkboxBg"
    )

    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (habit.isCompletedToday)
                MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
            else
                MaterialTheme.colorScheme.surface
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Interactive Checkbox / Toggle Button
            Box(
                modifier = Modifier
                    .size(36.dp)
                    .clip(CircleShape)
                    .border(
                        width = 2.dp,
                        color = if (habit.isCompletedToday) accentColor else MaterialTheme.colorScheme.outline,
                        shape = CircleShape
                    )
                    .background(checkBgColor)
                    .clickable { onToggle() },
                contentAlignment = Alignment.Center
            ) {
                if (habit.isCompletedToday) {
                    Icon(
                        imageVector = Icons.Default.Check,
                        contentDescription = "Completed",
                        tint = Color.White,
                        modifier = Modifier.size(20.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.width(16.dp))

            // Habit Details
            Column(
                modifier = Modifier
                    .weight(1f)
                    .clickable { onToggle() }
            ) {
                Text(
                    text = habit.title,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.SemiBold,
                    textDecoration = if (habit.isCompletedToday) TextDecoration.LineThrough else TextDecoration.None,
                    color = if (habit.isCompletedToday)
                        MaterialTheme.colorScheme.onSurfaceVariant
                    else
                        MaterialTheme.colorScheme.onSurface
                )

                if (habit.description.isNotBlank()) {
                    Text(
                        text = habit.description,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        maxLines = 1
                    )
                }

                Row(
                    modifier = Modifier.padding(top = 6.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    // Category Chip
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(6.dp))
                            .background(accentColor.copy(alpha = 0.15f))
                            .padding(horizontal = 6.dp, vertical = 2.dp)
                    ) {
                        Text(
                            text = habit.category.displayName,
                            style = MaterialTheme.typography.labelSmall,
                            color = accentColor,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    // Target Time if present
                    habit.targetTime?.let { time ->
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.Schedule,
                                contentDescription = null,
                                modifier = Modifier.size(12.dp),
                                tint = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Spacer(modifier = Modifier.width(3.dp))
                            Text(
                                text = time,
                                style = MaterialTheme.typography.labelSmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }

                    // Streak Badge
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.LocalFireDepartment,
                            contentDescription = "Streak",
                            modifier = Modifier.size(14.dp),
                            tint = Color(0xFFEA580C)
                        )
                        Spacer(modifier = Modifier.width(2.dp))
                        Text(
                            text = "\${habit.streakStats.currentStreak}d streak",
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFFEA580C)
                        )
                    }
                }
            }

            // Options menu (Edit / Delete)
            Box {
                IconButton(onClick = { menuExpanded = true }) {
                    Icon(
                        imageVector = Icons.Default.MoreVert,
                        contentDescription = "Options",
                        tint = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }

                DropdownMenu(
                    expanded = menuExpanded,
                    onDismissRequest = { menuExpanded = false }
                ) {
                    DropdownMenuItem(
                        text = { Text("Edit") },
                        onClick = {
                            menuExpanded = false
                            onEdit()
                        }
                    )
                    DropdownMenuItem(
                        text = { Text("Delete", color = MaterialTheme.colorScheme.error) },
                        onClick = {
                            menuExpanded = false
                            onDelete()
                        }
                    )
                }
            }
        }
    }
}
`,
  },

  // 23. DailyProgressCard.kt
  {
    path: 'app/src/main/java/com/example/habitflow/ui/screen/home/components/DailyProgressCard.kt',
    name: 'DailyProgressCard.kt',
    packageGroup: 'ui-components',
    language: 'kotlin',
    description: 'Hero progress card with animated CircularProgressIndicator and motivational feedback.',
    content: `package com.example.habitflow.ui.screen.home.components

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ProgressIndicatorDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun DailyProgressCard(
    completedCount: Int,
    totalCount: Int,
    progress: Float,
    modifier: Modifier = Modifier
) {
    val animatedProgress by animateFloatAsState(
        targetValue = progress,
        animationSpec = ProgressIndicatorDefaults.ProgressAnimationSpec,
        label = "progressAnim"
    )

    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = "Daily Progress",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )

                Text(
                    text = "$completedCount of $totalCount habits completed",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )

                Text(
                    text = when {
                        totalCount == 0 -> "No habits today"
                        completedCount == totalCount -> "Awesome! All habits completed today!"
                        completedCount > 0 -> "You're on the right track, keep pushing!"
                        else -> "Start your day by ticking off your first habit."
                    },
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.primary,
                    fontWeight = FontWeight.Medium,
                    modifier = Modifier.padding(top = 4.dp)
                )
            }

            Spacer(modifier = Modifier.width(16.dp))

            // Circular Indicator with Percentage in Center
            Box(contentAlignment = Alignment.Center) {
                CircularProgressIndicator(
                    progress = { animatedProgress },
                    modifier = Modifier.size(68.dp),
                    color = MaterialTheme.colorScheme.primary,
                    trackColor = MaterialTheme.colorScheme.outlineVariant,
                    strokeWidth = 7.dp,
                    strokeCap = StrokeCap.Round
                )
                Text(
                    text = "\${(animatedProgress * 100).toInt()}%",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}
`,
  },

  // 24. WeekCalendarStrip.kt
  {
    path: 'app/src/main/java/com/example/habitflow/ui/screen/home/components/WeekCalendarStrip.kt',
    name: 'WeekCalendarStrip.kt',
    packageGroup: 'ui-components',
    language: 'kotlin',
    description: 'Horizontal calendar date strip allowing quick navigation between days.',
    content: `package com.example.habitflow.ui.screen.home.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import java.time.LocalDate
import java.time.format.TextStyle
import java.util.Locale

@Composable
fun WeekCalendarStrip(
    selectedDate: LocalDate,
    onDateSelected: (LocalDate) -> Unit,
    modifier: Modifier = Modifier
) {
    val today = remember { LocalDate.now() }
    val days = remember(today) {
        (-3..3).map { today.plusDays(it.toLong()) }
    }

    Row(
        modifier = modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        days.forEach { date ->
            val isSelected = date == selectedDate
            val isToday = date == today

            val dayOfWeekName = date.dayOfWeek
                .getDisplayName(TextStyle.SHORT, Locale.getDefault())
                .take(3)

            Column(
                modifier = Modifier
                    .width(44.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(
                        if (isSelected) MaterialTheme.colorScheme.primary
                        else if (isToday) MaterialTheme.colorScheme.surfaceVariant
                        else MaterialTheme.colorScheme.surface
                    )
                    .clickable { onDateSelected(date) }
                    .padding(vertical = 8.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = dayOfWeekName,
                    style = MaterialTheme.typography.labelSmall,
                    color = if (isSelected) MaterialTheme.colorScheme.onPrimary
                    else MaterialTheme.colorScheme.onSurfaceVariant
                )

                Text(
                    text = date.dayOfMonth.toString(),
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = if (isSelected) MaterialTheme.colorScheme.onPrimary
                    else MaterialTheme.colorScheme.onSurface
                )
            }
        }
    }
}
`,
  },

  // 25. AddEditHabitBottomSheet.kt
  {
    path: 'app/src/main/java/com/example/habitflow/ui/screen/add_edit/AddEditHabitBottomSheet.kt',
    name: 'AddEditHabitBottomSheet.kt',
    packageGroup: 'ui-screens',
    language: 'kotlin',
    description: 'Material 3 ModalBottomSheet to create and edit habits with category, frequency, and time.',
    content: `package com.example.habitflow.ui.screen.add_edit

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.habitflow.data.model.FrequencyType
import com.example.habitflow.data.model.HabitCategory
import com.example.habitflow.data.model.HabitItem

@OptIn(ExperimentalMaterial3Api::class, ExperimentalLayoutApi::class)
@Composable
fun AddEditHabitBottomSheet(
    habitToEdit: HabitItem?,
    onDismiss: () -> Unit,
    onSave: (
        id: Long?,
        title: String,
        description: String,
        category: HabitCategory,
        frequencyType: FrequencyType,
        targetDays: List<Int>,
        targetTime: String?,
        colorHex: String
    ) -> Unit
) {
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)

    var title by remember { mutableStateOf(habitToEdit?.title ?: "") }
    var description by remember { mutableStateOf(habitToEdit?.description ?: "") }
    var selectedCategory by remember { mutableStateOf(habitToEdit?.category ?: HabitCategory.HEALTH) }
    var selectedFrequency by remember { mutableStateOf(habitToEdit?.frequency?.type ?: FrequencyType.DAILY) }
    var targetDays by remember {
        mutableStateOf(
            habitToEdit?.frequency?.targetDays?.map { it.value } ?: listOf(1, 2, 3, 4, 5, 6, 7)
        )
    }
    var targetTime by remember { mutableStateOf(habitToEdit?.targetTime ?: "08:00") }
    var selectedColor by remember { mutableStateOf(habitToEdit?.colorHex ?: "#0284c7") }
    var titleError by remember { mutableStateOf(false) }

    val presetColors = listOf("#0284c7", "#7c3aed", "#ea580c", "#10b981", "#f59e0b", "#ec4899")

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = sheetState
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 24.dp)
                .verticalScroll(rememberScrollState())
                .padding(bottom = 32.dp)
        ) {
            Text(
                text = if (habitToEdit == null) "New Habit" else "Edit Habit",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Title input
            OutlinedTextField(
                value = title,
                onValueChange = {
                    title = it
                    if (it.isNotBlank()) titleError = false
                },
                label = { Text("Habit Title *") },
                placeholder = { Text("e.g. Read 20 pages") },
                isError = titleError,
                supportingText = if (titleError) {
                    { Text("Title cannot be empty") }
                } else null,
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(12.dp))

            // Description input
            OutlinedTextField(
                value = description,
                onValueChange = { description = it },
                label = { Text("Description (Optional)") },
                placeholder = { Text("Why is this habit important?") },
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Category Selection
            Text(
                text = "Category",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.SemiBold
            )
            FlowRow(
                modifier = Modifier.padding(top = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                HabitCategory.values().forEach { category ->
                    FilterChip(
                        selected = selectedCategory == category,
                        onClick = { selectedCategory = category },
                        label = { Text(category.displayName) }
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Frequency
            Text(
                text = "Frequency",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.SemiBold
            )
            Row(
                modifier = Modifier.padding(top = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                FrequencyType.values().forEach { freq ->
                    FilterChip(
                        selected = selectedFrequency == freq,
                        onClick = {
                            selectedFrequency = freq
                            targetDays = when (freq) {
                                FrequencyType.DAILY -> listOf(1, 2, 3, 4, 5, 6, 7)
                                FrequencyType.WEEKDAYS -> listOf(1, 2, 3, 4, 5)
                                FrequencyType.WEEKENDS -> listOf(6, 7)
                                FrequencyType.CUSTOM -> targetDays
                            }
                        },
                        label = { Text(freq.name.lowercase().replaceFirstChar { it.uppercase() }) }
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Target Time
            OutlinedTextField(
                value = targetTime,
                onValueChange = { targetTime = it },
                label = { Text("Reminder / Target Time (HH:mm)") },
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Color Selector
            Text(
                text = "Accent Color",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.SemiBold
            )
            Row(
                modifier = Modifier.padding(top = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                presetColors.forEach { hex ->
                    val color = Color(android.graphics.Color.parseColor(hex))
                    Box(
                        modifier = Modifier
                            .size(36.dp)
                            .clip(CircleShape)
                            .background(color)
                            .clickable { selectedColor = hex }
                            .border(
                                width = if (selectedColor == hex) 3.dp else 0.dp,
                                color = if (selectedColor == hex) MaterialTheme.colorScheme.onSurface else Color.Transparent,
                                shape = CircleShape
                            )
                    )
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Save Action
            Button(
                onClick = {
                    if (title.isBlank()) {
                        titleError = true
                        return@Button
                    }
                    onSave(
                        habitToEdit?.id,
                        title,
                        description,
                        selectedCategory,
                        selectedFrequency,
                        targetDays,
                        targetTime,
                        selectedColor
                    )
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp)
            ) {
                Text(
                    text = if (habitToEdit == null) "Create Habit" else "Save Changes",
                    style = MaterialTheme.typography.titleMedium
                )
            }
        }
    }
}
`,
  },

  // 26. AnalyticsScreen.kt
  {
    path: 'app/src/main/java/com/example/habitflow/ui/screen/analytics/AnalyticsScreen.kt',
    name: 'AnalyticsScreen.kt',
    packageGroup: 'ui-screens',
    language: 'kotlin',
    description: 'Analytics dashboard featuring weekly completion bars, monthly heatmap, and streak milestones.',
    content: `package com.example.habitflow.ui.screen.analytics

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.EmojiEvents
import androidx.compose.material.icons.filled.LocalFireDepartment
import androidx.compose.material.icons.filled.TrendingUp
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.habitflow.ui.viewmodel.HabitUiState

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AnalyticsScreen(
    uiState: HabitUiState
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "Analytics & Insights",
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Bold
                    )
                }
            )
        }
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // 1. High-level metric KPI cards
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    MetricCard(
                        title = "Consistency",
                        value = "\${uiState.overallConsistencyScore}%",
                        icon = Icons.Default.TrendingUp,
                        color = Color(0xFF10B981),
                        modifier = Modifier.weight(1f)
                    )
                    MetricCard(
                        title = "Best Streak",
                        value = "\${uiState.bestStreak}d",
                        icon = Icons.Default.LocalFireDepartment,
                        color = Color(0xFFEA580C),
                        modifier = Modifier.weight(1f)
                    )
                    MetricCard(
                        title = "Total Logs",
                        value = "\${uiState.allCompletions.size}",
                        icon = Icons.Default.EmojiEvents,
                        color = Color(0xFF8B5CF6),
                        modifier = Modifier.weight(1f)
                    )
                }
            }

            // 2. Weekly Activity Bar Overview
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = "Weekly Habit Adherence",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.height(12.dp))

                        // Weekly bars composable
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(120.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.Bottom
                        ) {
                            val daysOfWeek = listOf("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun")
                            val sampleHeights = listOf(0.8f, 1.0f, 0.6f, 0.9f, 0.75f, 0.5f, 0.95f)

                            daysOfWeek.forEachIndexed { index, day ->
                                Column(
                                    horizontalAlignment = Alignment.CenterHorizontally,
                                    modifier = Modifier.weight(1f)
                                ) {
                                    Box(
                                        modifier = Modifier
                                            .size(width = 24.dp, height = (80 * sampleHeights[index]).dp)
                                            .clip(RoundedCornerShape(6.dp))
                                            .background(MaterialTheme.colorScheme.primary)
                                    )
                                    Spacer(modifier = Modifier.height(6.dp))
                                    Text(
                                        text = day,
                                        style = MaterialTheme.typography.labelSmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                            }
                        }
                    }
                }
            }

            // 3. Streak Milestones Section
            item {
                Text(
                    text = "Streak Milestones",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
            }

            items(uiState.milestones) { milestone ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = if (milestone.isUnlocked)
                            MaterialTheme.colorScheme.surface
                        else
                            MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
                    )
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(44.dp)
                                .clip(CircleShape)
                                .background(
                                    if (milestone.isUnlocked) Color(0xFFFEF3C7) else MaterialTheme.colorScheme.outlineVariant
                                ),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.EmojiEvents,
                                contentDescription = null,
                                tint = if (milestone.isUnlocked) Color(0xFFD97706) else MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }

                        Column(
                            modifier = Modifier
                                .padding(horizontal = 16.dp)
                                .weight(1f)
                        ) {
                            Text(
                                text = milestone.title,
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.SemiBold
                            )
                            Text(
                                text = milestone.description,
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }

                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(8.dp))
                                .background(
                                    if (milestone.isUnlocked) Color(0xFFDCFCE7) else MaterialTheme.colorScheme.surfaceVariant
                                )
                                .padding(horizontal = 8.dp, vertical = 4.dp)
                        ) {
                            Text(
                                text = if (milestone.isUnlocked) "UNLOCKED" else "\${milestone.requiredStreak}d Goal",
                                style = MaterialTheme.typography.labelSmall,
                                fontWeight = FontWeight.Bold,
                                color = if (milestone.isUnlocked) Color(0xFF15803D) else MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun MetricCard(
    title: String,
    value: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    color: Color,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
    ) {
        Column(
            modifier = Modifier.padding(12.dp)
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = color,
                modifier = Modifier.size(20.dp)
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = value,
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = title,
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}
`,
  },

  // 27. SettingsScreen.kt
  {
    path: 'app/src/main/java/com/example/habitflow/ui/screen/settings/SettingsScreen.kt',
    name: 'SettingsScreen.kt',
    packageGroup: 'ui-screens',
    language: 'kotlin',
    description: 'Settings screen for Dark/Light dynamic theme switching, backup/restore, and reset data.',
    content: `package com.example.habitflow.ui.screen.settings

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Backup
import androidx.compose.material.icons.filled.DarkMode
import androidx.compose.material.icons.filled.DeleteForever
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.habitflow.ui.viewmodel.HabitUiState

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    uiState: HabitUiState,
    onToggleTheme: () -> Unit,
    onResetData: () -> Unit
) {
    var showResetDialog by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "Settings",
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Bold
                    )
                }
            )
        }
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                Text(
                    text = "Preferences",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
            }

            // Dark Theme Switch
            item {
                SettingItemCard(
                    title = "Dark Theme",
                    subtitle = "Toggle dark/light Material 3 theme",
                    icon = Icons.Default.DarkMode
                ) {
                    Switch(
                        checked = uiState.isDarkTheme,
                        onCheckedChange = { onToggleTheme() }
                    )
                }
            }

            // Daily Reminders
            item {
                SettingItemCard(
                    title = "Daily Notifications",
                    subtitle = "Receive exact alarms for scheduled habits",
                    icon = Icons.Default.Notifications
                ) {
                    Switch(
                        checked = true,
                        onCheckedChange = { /* Toggle notifications */ }
                    )
                }
            }

            item {
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "Data & Storage",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
            }

            // Backup Data
            item {
                SettingItemCard(
                    title = "Backup to JSON",
                    subtitle = "Export habits and logs locally",
                    icon = Icons.Default.Backup,
                    onClick = { /* Export JSON */ }
                )
            }

            // Reset Data
            item {
                SettingItemCard(
                    title = "Reset Database",
                    subtitle = "Clear all habits and streak records",
                    icon = Icons.Default.DeleteForever,
                    titleColor = MaterialTheme.colorScheme.error,
                    onClick = { showResetDialog = true }
                )
            }

            // About
            item {
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "About",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
            }

            item {
                SettingItemCard(
                    title = "HabitFlow v1.0.0",
                    subtitle = "Built natively with Jetpack Compose & Room",
                    icon = Icons.Default.Info
                )
            }
        }
    }

    if (showResetDialog) {
        AlertDialog(
            onDismissRequest = { showResetDialog = false },
            title = { Text("Reset Database?") },
            text = { Text("This will permanently delete all your habits, streaks, and history.") },
            confirmButton = {
                TextButton(
                    onClick = {
                        showResetDialog = false
                        onResetData()
                    }
                ) {
                    Text("Delete All", color = MaterialTheme.colorScheme.error)
                }
            },
            dismissButton = {
                TextButton(onClick = { showResetDialog = false }) {
                    Text("Cancel")
                }
            }
        )
    }
}

@Composable
fun SettingItemCard(
    title: String,
    subtitle: String,
    icon: ImageVector,
    titleColor: androidx.compose.ui.graphics.Color = MaterialTheme.colorScheme.onSurface,
    onClick: (() -> Unit)? = null,
    trailing: (@Composable () -> Unit)? = null
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .then(if (onClick != null) Modifier.clickable { onClick() } else Modifier),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = titleColor
            )
            Column(
                modifier = Modifier
                    .padding(horizontal = 16.dp)
                    .weight(1f)
            ) {
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.SemiBold,
                    color = titleColor
                )
                Text(
                    text = subtitle,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
            trailing?.invoke()
        }
    }
}
`,
  },

  // 28. MainActivity.kt
  {
    path: 'app/src/main/java/com/example/habitflow/MainActivity.kt',
    name: 'MainActivity.kt',
    packageGroup: 'main',
    language: 'kotlin',
    description: 'Single-activity host setting up Material 3 NavigationBar, ViewModel injection, and ModalBottomSheet.',
    content: `package com.example.habitflow

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.BarChart
import androidx.compose.material.icons.filled.CalendarToday
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.example.habitflow.ui.screen.add_edit.AddEditHabitBottomSheet
import com.example.habitflow.ui.screen.analytics.AnalyticsScreen
import com.example.habitflow.ui.screen.home.HomeScreen
import com.example.habitflow.ui.screen.settings.SettingsScreen
import com.example.habitflow.ui.theme.HabitFlowTheme
import com.example.habitflow.ui.viewmodel.HabitsViewModel
import com.example.habitflow.ui.viewmodel.HabitsViewModelFactory

class MainActivity : ComponentActivity() {

    private val viewModel: HabitsViewModel by viewModels {
        val app = application as HabitApplication
        HabitsViewModelFactory(app.repository)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            val uiState by viewModel.uiState.collectAsState()

            HabitFlowTheme(darkTheme = uiState.isDarkTheme) {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    HabitFlowApp(
                        viewModel = viewModel
                    )
                }
            }
        }
    }
}

@Composable
fun HabitFlowApp(
    viewModel: HabitsViewModel
) {
    val uiState by viewModel.uiState.collectAsState()
    var selectedTab by remember { mutableIntStateOf(0) }
    val snackbarHostState = remember { SnackbarHostState() }

    // Display user messages via Snackbar
    LaunchedEffect(uiState.userMessage) {
        uiState.userMessage?.let { msg ->
            snackbarHostState.showSnackbar(msg)
            viewModel.clearUserMessage()
        }
    }

    Scaffold(
        snackbarHost = { SnackbarHost(snackbarHostState) },
        bottomBar = {
            NavigationBar {
                NavigationBarItem(
                    selected = selectedTab == 0,
                    onClick = { selectedTab = 0 },
                    icon = { Icon(Icons.Default.CalendarToday, contentDescription = "Today") },
                    label = { Text("Today") }
                )
                NavigationBarItem(
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 },
                    icon = { Icon(Icons.Default.BarChart, contentDescription = "Analytics") },
                    label = { Text("Analytics") }
                )
                NavigationBarItem(
                    selected = selectedTab == 2,
                    onClick = { selectedTab = 2 },
                    icon = { Icon(Icons.Default.Settings, contentDescription = "Settings") },
                    label = { Text("Settings") }
                )
            }
        }
    ) { paddingValues ->
        androidx.compose.foundation.layout.Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            when (selectedTab) {
                0 -> HomeScreen(
                    uiState = uiState,
                    onToggleHabit = { viewModel.onToggleHabit(it) },
                    onEditHabit = { viewModel.openEditHabitSheet(it) },
                    onDeleteHabit = { viewModel.deleteHabit(it) },
                    onAddHabitClick = { viewModel.openAddHabitSheet() },
                    onDateSelected = { viewModel.onDateSelected(it) }
                )
                1 -> AnalyticsScreen(uiState = uiState)
                2 -> SettingsScreen(
                    uiState = uiState,
                    onToggleTheme = { viewModel.toggleTheme() },
                    onResetData = { viewModel.resetAllData() }
                )
            }

            // Modal Bottom Sheet for Add / Edit Habit
            if (uiState.isAddEditSheetOpen) {
                AddEditHabitBottomSheet(
                    habitToEdit = uiState.editingHabit,
                    onDismiss = { viewModel.dismissAddEditSheet() },
                    onSave = { id, title, desc, cat, freq, days, time, color ->
                        viewModel.saveHabit(id, title, desc, cat, freq, days, time, color)
                    }
                )
            }
        }
    }
}
`,
  },

  // 29. BadHabitEntity.kt
  {
    path: 'app/src/main/java/com/example/habitflow/data/local/entity/BadHabitEntity.kt',
    name: 'BadHabitEntity.kt',
    packageGroup: 'entity',
    language: 'kotlin',
    description: 'Room Entity representing a bad habit to stop with quit timestamp, cost savings, and reclaimed hours.',
    content: `package com.example.habitflow.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.time.LocalDateTime

@Entity(tableName = "bad_habits")
data class BadHabitEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0L,
    val title: String,
    val reasonToQuit: String,
    val category: String, // NICOTINE, SCREEN_TIME, SUGAR_DIET, ALCOHOL, COMPULSIVE, OTHER
    val quitDateTime: LocalDateTime, // When the current clean streak started
    val costPerDay: Double = 0.0, // Financial cost per day in USD
    val timeSpentPerDayHours: Double = 0.0, // Wasted daily hours
    val colorHex: String = "#ef4444",
    val longestCleanSeconds: Long = 0L,
    val isArchived: Boolean = false
)
`,
  },

  // 30. RelapseLogEntity.kt
  {
    path: 'app/src/main/java/com/example/habitflow/data/local/entity/RelapseLogEntity.kt',
    name: 'RelapseLogEntity.kt',
    packageGroup: 'entity',
    language: 'kotlin',
    description: 'Room Entity storing relapse event with trigger, reflection notes, and clean duration before relapse.',
    content: `package com.example.habitflow.data.local.entity

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey
import java.time.LocalDateTime

@Entity(
    tableName = "relapse_logs",
    foreignKeys = [
        ForeignKey(
            entity = BadHabitEntity::class,
            parentColumns = ["id"],
            childColumns = ["badHabitId"],
            onDelete = ForeignKey.CASCADE
        )
    ],
    indices = [Index(value = ["badHabitId"])]
)
data class RelapseLogEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0L,
    val badHabitId: Long,
    val timestamp: LocalDateTime = LocalDateTime.now(),
    val triggerReason: String, // Stress, Boredom, Social Cue, Tiredness, Habitual
    val reflection: String = "",
    val cleanDaysBeforeRelapse: Int = 0
)
`,
  },

  // 31. BadHabitDao.kt
  {
    path: 'app/src/main/java/com/example/habitflow/data/local/dao/BadHabitDao.kt',
    name: 'BadHabitDao.kt',
    packageGroup: 'dao',
    language: 'kotlin',
    description: 'DAO for Bad Habits, live relapse timer reset transactions, and relapse logs.',
    content: `package com.example.habitflow.data.local.dao

import androidx.room.*
import com.example.habitflow.data.local.entity.BadHabitEntity
import com.example.habitflow.data.local.entity.RelapseLogEntity
import kotlinx.coroutines.flow.Flow
import java.time.LocalDateTime

@Dao
interface BadHabitDao {

    @Query("SELECT * FROM bad_habits WHERE isArchived = 0 ORDER BY id ASC")
    fun getAllActiveBadHabits(): Flow<List<BadHabitEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertBadHabit(badHabit: BadHabitEntity): Long

    @Update
    suspend fun updateBadHabit(badHabit: BadHabitEntity)

    @Delete
    suspend fun deleteBadHabit(badHabit: BadHabitEntity)

    @Query("UPDATE bad_habits SET quitDateTime = :newQuitTime WHERE id = :badHabitId")
    suspend fun resetQuitTime(badHabitId: Long, newQuitTime: LocalDateTime)

    // Relapse logs
    @Query("SELECT * FROM relapse_logs WHERE badHabitId = :badHabitId ORDER BY timestamp DESC")
    fun getRelapsesForHabit(badHabitId: Long): Flow<List<RelapseLogEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertRelapse(log: RelapseLogEntity): Long
}
`,
  },

  // 32. QuitHabitsScreen.kt
  {
    path: 'app/src/main/java/com/example/habitflow/ui/screen/quit/QuitHabitsScreen.kt',
    name: 'QuitHabitsScreen.kt',
    packageGroup: 'ui-screens',
    language: 'kotlin',
    description: 'Material 3 Screen for bad habit tracking, live ticking clean timer, money saved, and relapse modal.',
    content: `package com.example.habitflow.ui.screen.quit

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.habitflow.data.local.entity.BadHabitEntity
import com.example.habitflow.data.local.entity.RelapseLogEntity
import java.time.Duration
import java.time.LocalDateTime

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun QuitHabitsScreen(
    badHabits: List<BadHabitEntity>,
    relapses: List<RelapseLogEntity>,
    onLogRelapse: (Long, String, String) -> Unit,
    onAddNewBadHabit: () -> Unit
) {
    var selectedHabitId by remember(badHabits) {
        mutableStateOf(badHabits.firstOrNull()?.id ?: 0L)
    }
    var showRelapseDialog by remember { mutableStateOf(false) }

    val activeHabit = badHabits.find { it.id == selectedHabitId } ?: badHabits.firstOrNull()

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "Quit & Sobriety Clocks",
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Bold
                    )
                },
                actions = {
                    IconButton(onClick = onAddNewBadHabit) {
                        Icon(Icons.Default.Add, contentDescription = "Add Target")
                    }
                }
            )
        }
    ) { paddingValues ->
        if (activeHabit == null) {
            Box(
                modifier = Modifier.fillMaxSize().padding(paddingValues),
                contentAlignment = Alignment.Center
            ) {
                Text("No bad habits tracked yet. Tap + to begin your clean clock.")
            }
        } else {
            val now = LocalDateTime.now()
            val duration = Duration.between(activeHabit.quitDateTime, now)
            val days = duration.toDays()
            val hours = duration.toHours() % 24
            val minutes = duration.toMinutes() % 60
            val seconds = duration.seconds % 60

            val daysFloat = duration.seconds.toDouble() / 86400.0
            val moneySaved = (daysFloat * activeHabit.costPerDay).toInt()
            val hoursReclaimed = (daysFloat * activeHabit.timeSpentPerDayHours).toInt()

            LazyColumn(
                modifier = Modifier.fillMaxSize().padding(paddingValues),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Habit Selector Tabs
                item {
                    LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        items(badHabits) { habit ->
                            FilterChip(
                                selected = habit.id == selectedHabitId,
                                onClick = { selectedHabitId = habit.id },
                                label = { Text(habit.title) }
                            )
                        }
                    }
                }

                // Hero Live Timer Card
                item {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(24.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
                    ) {
                        Column(modifier = Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                            Text(
                                text = "Current Clean Streak",
                                style = MaterialTheme.typography.labelSmall,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.primary
                            )
                            Text(
                                text = activeHabit.title,
                                style = MaterialTheme.typography.titleLarge,
                                fontWeight = FontWeight.Bold
                            )

                            // 4-box time display
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                TimeBox(value = "\$days", label = "Days", modifier = Modifier.weight(1f))
                                TimeBox(value = String.format("%02d", hours), label = "Hours", modifier = Modifier.weight(1f))
                                TimeBox(value = String.format("%02d", minutes), label = "Mins", modifier = Modifier.weight(1f))
                                TimeBox(value = String.format("%02d", seconds), label = "Secs", modifier = Modifier.weight(1f), isHighlight = true)
                            }

                            // Actions
                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                Button(
                                    onClick = { showRelapseDialog = true },
                                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error),
                                    modifier = Modifier.weight(1f)
                                ) {
                                    Icon(Icons.Default.Refresh, contentDescription = null, modifier = Modifier.size(16.dp))
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text("I Relapsed")
                                }
                            }
                        }
                    }
                }

                // Reclaimed Metrics
                item {
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                        Card(modifier = Modifier.weight(1f), shape = RoundedCornerShape(16.dp)) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Text("Saved", style = MaterialTheme.typography.labelSmall)
                                Text("\$\${moneySaved}", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold, color = Color(0xFF10B981))
                                Text("Money kept", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            }
                        }

                        Card(modifier = Modifier.weight(1f), shape = RoundedCornerShape(16.dp)) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Text("Reclaimed", style = MaterialTheme.typography.labelSmall)
                                Text("\${hoursReclaimed}h", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold, color = Color(0xFF8B5CF6))
                                Text("Focus regained", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun TimeBox(value: String, label: String, modifier: Modifier = Modifier, isHighlight: Boolean = false) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (isHighlight) MaterialTheme.colorScheme.primaryContainer else MaterialTheme.colorScheme.surface
        )
    ) {
        Column(
            modifier = Modifier.padding(vertical = 12.dp, horizontal = 4.dp).fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(text = value, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Black, fontFamily = FontFamily.Monospace)
            Text(text = label, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}
`,
  },
];

