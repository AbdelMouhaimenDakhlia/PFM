package com.pfm.pfmbackend.batch.config;

import com.pfm.pfmbackend.batch.dto.TransactionCsvDTO;
import com.pfm.pfmbackend.batch.processor.TransactionItemProcessor;
import com.pfm.pfmbackend.batch.writer.TransactionJpaWriter;
import com.pfm.pfmbackend.repository.ComptBancaireRepository;
import com.pfm.pfmbackend.repository.TransactionRepository;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.ItemWriter;
import org.springframework.batch.item.file.FlatFileItemReader;
import org.springframework.batch.item.file.FlatFileItemWriter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

@Configuration
@EnableBatchProcessing
public class BatchConfig {

    @Bean
    public Job transactionJob(JobRepository jobRepository,
                              Step stepCategorize) {
        return new JobBuilder("transactionCategorizationJob", jobRepository)
                .start(stepCategorize)
                .build();
    }

    @Bean
    public Step stepCategorize(JobRepository jobRepository,
                               PlatformTransactionManager transactionManager,
                               FlatFileItemReader<TransactionCsvDTO> reader,
                               TransactionItemProcessor processor,
                               TransactionJpaWriter writer) {
        return new StepBuilder("categorizeTransactionStep", jobRepository)
                .<TransactionCsvDTO, TransactionCsvDTO>chunk(10, transactionManager)
                .reader(reader)
                .processor(processor)
                .writer(writer)
                .build();
    }
}
