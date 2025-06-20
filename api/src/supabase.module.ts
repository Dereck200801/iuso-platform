import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'SUPABASE',
      useFactory: (config: ConfigService): SupabaseClient => {
        return createClient(
          config.get<string>('SUPABASE_URL')!,
          config.get<string>('SUPABASE_SERVICE_ROLE_KEY')!
        )
      },
      inject: [ConfigService],
    },
  ],
  exports: ['SUPABASE'],
})
export class SupabaseModule {} 